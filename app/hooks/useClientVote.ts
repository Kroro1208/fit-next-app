import { useState } from 'react';

interface VoteState {
    upVoteCount: number;
    downVoteCount: number;
    trustScore: number;
    userVote: 'UP' | 'DOWN' | null;
}

export function useClientVote(initialState: VoteState, postId: string) {
    const [voteState, setVoteState] = useState({
        ...initialState,
        trustScore: initialState.trustScore || 50
    });

    const clientVote = async (direction: 'UP' | 'DOWN') => {
        const previousState = { ...voteState };
    
        setVoteState(prev => {
            const newState = { ...prev };
            if (direction === prev.userVote) {
                // 同じ方向に再度投票した場合、投票を取り消す
                if (direction === 'UP') {
                    newState.upVoteCount--;
                } else {
                    newState.downVoteCount--;
                }
                newState.userVote = null;
            } else {
                // 新しい投票または反対方向への投票
                if (prev.userVote) {
                    // 既存の投票を取り消す
                    if (prev.userVote === 'UP') {
                        newState.upVoteCount--;
                    } else {
                        newState.downVoteCount--;
                    }
                }
                // 新しい投票を追加
                if (direction === 'UP') {
                    newState.upVoteCount++;
                } else {
                    newState.downVoteCount++;
                }
                newState.userVote = direction;
            }
            return newState;
        });
    
        try {
            const result = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, voteDirection: direction }),
            });
    
            if (!result.ok) {
                const errorText = await result.text();
                console.error('Vote failed:', result.status, errorText);
                throw new Error(`Vote failed: ${result.status} ${errorText}`);
            }
    
            const updatedState = await result.json();
            setVoteState(prev => ({
                ...updatedState,
                userVote: updatedState.userVote || prev.userVote
            }));
        } catch (error) {
            console.error('Vote error:', error);
            setVoteState(previousState);
            throw error;
        }
    };

    return { voteState, clientVote };
}
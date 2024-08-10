'use client'

import { useState } from 'react';

interface VoteState {
    upVoteCount: number;
    downVoteCount: number;
    trustScore: number;
}

export function useClientVote(initialState: VoteState, postId: string) {
    const [voteState, setVoteState] = useState(initialState);

    const clientVote = async (direction: 'UP' | 'DOWN') => {
        const previousState = { ...voteState };
    
        setVoteState(prev => {
            const newState = { ...prev };
            if (direction === 'UP') {
                newState.upVoteCount++;
            } else {
                newState.downVoteCount++;
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
            setVoteState(updatedState);
        } catch (error) {
            console.error('Vote error:', error);
            setVoteState(previousState);
            throw error;
        }
    };

    return { voteState, clientVote };
}
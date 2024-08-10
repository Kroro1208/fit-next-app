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
            const formData = new FormData();
            formData.append('postId', postId);
            formData.append('voteDirection', direction);

            const result = await fetch('/api/vote', {
                method: 'POST',
                body: formData,
            });

            if (!result.ok) {
                throw new Error('Vote failed');
            }

            const updatedState = await result.json();
            setVoteState(updatedState);
        } catch (error) {
            console.error('Vote failed:', error);
            setVoteState(previousState);
            throw error;
        }
    };

    return { voteState, clientVote };
}
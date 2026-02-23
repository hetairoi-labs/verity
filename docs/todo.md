### MVP Deadline: 28/02/2026
- Host
    - should be able to create a session (target goals, price in usdc, duration / expiry)
    - one session, multiple meetings
    - a dashboard for host to see: estimated payout multiplier + analysis & reasoning behind the score + suggestions to improve the score
    - host clicks a button to submit session completion event -> which triggers the payout process.

- User
    - browse sessions (get all sessions, paginated)
    - see individual session details (summary, goals, duration, etc.)
    - should be able to join a session by depositing usdc (contract deposit)
    - a dashboard where they can see their session history, active sessions, session details (session & goal progress status)
    - show their refund amount from the submitted session price based on the payout score (estimated + actual)

- System
    - transcript.done webhook saves the transcript to the database (for each meeting)

    - Create verification score calculation function
        - AI gives raw score (based on transcript)
        - Manual algorithmic framework based on raw score, participant feedback, etc. to give a payout score
        - Map the payout score using sigmoid curve to get the payout multiplier

    - this verification function is used by server to show estimated multiplier + analysis & reasoning behind the score + suggestions to improve the score
    - same verification function is used by chainlink CRE to verify the session completion event and payout the users. (on host finish)
    
    - Chainlink CRE function:
        - calls server with sessionId to get the session details + goals details + transcripts. (confidential http)
        - calls verification function to get the payout score based on this.
        - triggers the onchain event to payout the users. (evm.write)

    - add activation keyword for live session.
import React from 'react';
import PropTypes from 'prop-types';
import './ParticipantList.scss';

export default function ParticipantList({ participants = [] }) {
  return (
    <div className="participant-list">
      <div className="participant-list__header">
        <span>Participants ({participants.length})</span>
      </div>
      <div className="participant-list__participants">
        {participants.map((participant) => (
          <div key={participant.id} className="participant-list__participant">
            {participant.username}
          </div>
        ))}
      </div>
    </div>
  );
}

ParticipantList.propTypes = {
  participants: PropTypes.array.isRequired,
};

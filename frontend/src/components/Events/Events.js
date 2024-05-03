import styles from '~/styles/styles';
import EventCard from './EventCard';
import { useSelector } from 'react-redux';

function Events() {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  
  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Populer Events</h1>
          </div>

          <div className="w-full grid">
            {allEvents && allEvents.length !== 0 ? (
              allEvents.map((event, index) => (
                <EventCard key={index} active={true} data={event} />
              ))
            ) : (
              <h4>No Events available!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;

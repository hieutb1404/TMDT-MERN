import styles from '~/styles/styles';
import EventCard from './EventCard';
import { useSelector } from 'react-redux';
function Events() {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <div>
      {!isLoading && allEvents && allEvents.length > 0 && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Populer Events</h1>
          </div>

          <div className="w-full grid">
            <EventCard active={true} data={allEvents && allEvents[0]} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;

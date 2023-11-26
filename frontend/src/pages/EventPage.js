import { useSelector } from 'react-redux';
import EventCard from '~/components/Events/EventCard';
import Loader from '~/layouts/Loader/Loader';
import Header from '~/layouts/components/Header';

function Events() {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} data={allEvents && allEvents[0]} />
        </div>
      )}
    </>
  );
}

export default Events;

import Events from '~/components/Events/Events';
import BestDeals from '~/components/Route/BestDeals/BestDeals';
import Categories from '~/components/Route/Categories/Categories';
import FeaturedProduct from '~/components/Route/FeaturedProduct/FeaturedProduct';
import Hero from '~/components/Route/Hero/Hero';
import Sponsored from '~/components/Route/Sponsored';

function HomePage() {
  return (
    <div>
      <Hero />
      <Categories />
      <BestDeals />
      <Events />
      <FeaturedProduct />
      <Sponsored />
    </div>
  );
}

export default HomePage;

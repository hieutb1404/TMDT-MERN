import { useState } from 'react';
import ProfileContent from '~/components/Profile/ProfileContent';
import ProfileSidebar from '~/components/Profile/ProfileSidebar';
import Header from '~/layouts/components/Header';
import styles from '~/styles/styles';

function ProfilePage() {
  const [active, setActive] = useState(1);

  return (
    <div>
      <Header />
      <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
        <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[10%]">
          <ProfileSidebar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
    </div>
  );
}

export default ProfilePage;

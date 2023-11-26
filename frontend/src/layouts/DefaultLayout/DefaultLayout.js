import React from 'react';

import Header from '~/layouts/components/Header';
import Footer from '~/layouts/components/Footer';
const DefaultLayout = ({ children }) => {
  return (
    <div className="wrapper">
      {/* truyen 1 de danh dau Navbar hien tai la navbar minh click la navbar nao 
        - vi du minh o trang home thi home se duoc active css phat sang'
      */}
      <Header activeHeading={1} />
      <div className="content">{children}</div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} 숫자야구 게임. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
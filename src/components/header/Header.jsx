import React from 'react';

function Header() {
  return (
    <div style={styles.container}>
      <h2>Weather Now</h2>
    </div>
  );
}
const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial',
  },
};

export default Header;

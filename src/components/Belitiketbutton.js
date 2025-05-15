import Link from 'next/link';

const Belitiketbutton = () => {
  return (
    <Link href="/register/ticket">
      <button style={styles.button}>
        Beli Tiket
      </button>
    </Link>
  );
};

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#FEBA15',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};

export default Belitiketbutton;
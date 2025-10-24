import Address from '@/modules/Address';

export default function Home() {
  setTimeout(() => {
    const a = JOJO.popup(<Address />, {
      animate: false,
      bodyStyle: {
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        margin: 0,
        backgroundColor: '#fff'
      }
    });
    setTimeout(() => {
      a.destroy();
    }, 2000);
  }, 1000);
  return (
    <div>
      {/* <Address /> */}
      <h1>🍉 Fruit List</h1>
    </div>
  );
}

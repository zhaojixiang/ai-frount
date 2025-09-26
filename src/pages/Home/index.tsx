export default function Home() {
  // const mutation = useMutation({
  //   mutationFn: saveItem,
  //   onSuccess: () => {
  //     // 保存成功后，刷新列表
  //     queryClient.invalidateQueries({ queryKey: ['fruitList'] });
  //   }
  // });

  // const handleSave = () => {
  //   mutation
  //     .mutate('🍍 Pineapple')
  //     .then(() => {
  //       alert('保存成功！');
  //     })
  //     .catch(() => {
  //       alert('保存失败！');
  //     });
  // };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🍉 Fruit List</h1>
      <ul>
        {/* {data.map((item) => (
          <li key={item}>{item}</li>
        ))} */}
      </ul>
      {/* <button onClick={handleSave} disabled={mutation.isPending}>
        {mutation.isPending ? '保存中...' : '新增 🍍 Pineapple'}
      </button> */}
    </div>
  );
}

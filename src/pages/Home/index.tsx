import { useQuery } from '@tanstack/react-query';

import { ErrorFallback } from '@/components/ErrorFallback';
import { Loading } from '@/components/Loading';
import { getDetail } from '@/services/api';

export default function Home() {
  const {
    data: pageData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['fruitList'],
    queryFn: () => getDetail({ linkCode: 'NLAmSLwHTNN' })
  });
  console.log(222222, pageData, isLoading, isError, refetch);

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

  if (isLoading) return <Loading />;
  if (isError) return <ErrorFallback onRetry={refetch} />;

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

import S from './index.module.less';

interface IProps {
  text: string;
}

export default (props: IProps) => {
  const { text } = props;
  return <div className={S.title}>{text}</div>;
};

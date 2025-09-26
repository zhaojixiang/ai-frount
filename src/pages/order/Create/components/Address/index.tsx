import cx from 'classnames';

// import { sensClickInitiative } from '@/utils/sensors';
import S from './index.module.less';

interface IProps {
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
  key?: string;
  toAddress: (id?: string) => void;
  isRequestAddress?: boolean;
  detail?: any;
}
const Index = (props: IProps) => {
  const { className, topClassName, bottomClassName, key, toAddress, isRequestAddress } = props;

  const { detail } = props;
  const curdetail: any = {
    addressDetail: detail.address,
    cityRegionName: detail.cityName,
    areaRegionName: detail.districtName,
    recipientPhone: detail.phone,
    provinceRegionName: detail.provinceName,
    recipientName: detail.receiverName,
    ...detail
  };

  /**
   * 添加地址
   */
  const handleToAddress = () => {
    // sensClickInitiative({
    //   $element_name: '确认订单收银台-添加地址'
    // });
    toAddress();
  };

  /**
   * 选择地址
   */
  const handleSelectAddress = () => {
    // sensClickInitiative({
    //   $element_name: '确认订单收银台-选择地址'
    // });
    toAddress(curdetail.id);
  };

  return (
    <div className={cx(S.addressWrap, className)}>
      {curdetail?.id ? (
        <div className={cx(S.addressItem)} key={key || curdetail.id} onClick={handleSelectAddress}>
          <div className={S.locationIcon} />
          <div className={S.addressContent}>
            <div className={cx(S.itemTop, topClassName)}>
              <span className={S.name}>{curdetail.recipientName}</span>
              <span className={S.phone}>{curdetail.recipientPhone}</span>
            </div>
            <div className={cx(S.itemBottom, bottomClassName)}>
              {`${curdetail.provinceRegionName || ''}${curdetail.cityRegionName || ''}${
                curdetail.areaRegionName || ''
              }${curdetail.addressDetail || ''}`}
            </div>
          </div>
          <div className={S.rightIcon} />
        </div>
      ) : (
        <div onClick={handleToAddress} className={S.addressAddInner}>
          <div className={S.locationIcon} />
          <div className={S.noAddressText}>暂无收货地址</div>
          {!isRequestAddress ? (
            <div className={S.addAddressText}>
              <span>添加地址</span>
              <div className={S.rightIcon} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Index;

import { Picker } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';

import { getProvince, getRegion } from '@/services/api/order';

import S from './index.module.less';

interface IProps {
  onChange?: (val: any[]) => void;
  value?: any[];
}

export default (props: IProps) => {
  const { onChange, value = [] } = props;
  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [districtList, setDistrictList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);

  const [preView, setPreView] = useState<string>('');

  const prevValueRef = useRef<any[]>([]);

  const columns = [provinceList, cityList, districtList];

  useEffect(() => {
    setPreView(columns.map((col, i) => col.find((x) => x.value === value[i])?.label).join(' '));
  }, [value]);

  useEffect(() => {
    (async () => {
      const provincesRes = await getProvince();
      const { data } = provincesRes || {};
      const provinces = data.map((item: { id: string; regionName: string }) => ({
        value: item.id,
        label: item.regionName
      }));
      setProvinceList(provinces);

      if (provinces.length > 0) {
        const firstProvince = provinces[0].value;
        const cities: any = await getCitysOrArea(firstProvince);
        setCityList(cities);

        if (cities?.length > 0) {
          const firstCity = cities[0].value;
          const districts: any = await getCitysOrArea(firstCity);
          setDistrictList(districts);
        }
      }
    })();
  }, []);

  const getCitysOrArea = (id: string) => {
    return new Promise<any[]>((resolve) => {
      getRegion({
        parentId: id
      }).then((res) => {
        const { data } = res || {};
        const next =
          data?.map((item: any) => ({
            value: item.id,
            label: item.regionName
          })) || [];
        resolve(next);
      });
    });
  };

  const onAreaChange = async (val: any[]) => {
    const prev = prevValueRef.current;
    const [prevProvince, prevCity] = prev;
    const [curProvince, curCity] = val;

    // 切换省
    if (curProvince !== prevProvince) {
      const cities: any = await getCitysOrArea(curProvince);
      setCityList(cities);
      const firstCity = cities[0]?.value;
      const districts: any = await getCitysOrArea(firstCity);
      setDistrictList(districts);
      const firstDistrict = districts[0]?.value;
      const newVal = [curProvince, firstCity, firstDistrict];
      prevValueRef.current = newVal;
      return;
    }

    // 切换市
    if (curCity !== prevCity) {
      const districts: any = await getCitysOrArea(curCity);
      setDistrictList(districts);
      const firstDistrict = districts[0]?.value;
      const newVal = [curProvince, curCity, firstDistrict];
      prevValueRef.current = newVal;
      return;
    }

    prevValueRef.current = val;
  };

  const handleConfirm = (val: any[]) => {
    onChange?.(val);
    prevValueRef.current = val;
  };

  return (
    <>
      <div onClick={() => setVisible(true)}>
        {value?.length ? preView : <span className={S.placeholder}>请选择省市区</span>}
      </div>
      <Picker
        columns={columns}
        visible={visible}
        value={value}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
        onSelect={onAreaChange}
      />
    </>
  );
};

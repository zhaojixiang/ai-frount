import { Button, Form, Input, TextArea } from 'antd-mobile';

import { createAddress } from '@/services/api/order';

import AreaInput from './AreaInput';
import S from './index.module.less';
import ZoneCodeInput from './ZoneCodeInput';

interface IProps {
  onSubmit?: (addressId: number) => void;
}

export default ({ onSubmit }: IProps) => {
  const [form] = Form.useForm();
  /**
   * 确认
   */
  const submit = () => {
    form
      .validateFields()
      .then((values) => {
        const { name, phone, area, regionCode, addressDetail } = values;
        const params: any = {
          recipientName: name,
          recipientPhone: phone,
          addressDetail,
          provinceRegionId: area[0],
          cityRegionId: area[1],
          areaRegionId: area[2],
          regionCode: regionCode[0] || '+86'
        };
        createAddress(params).then((res) => {
          if (res?.resultCode === 200) {
            JOJO.toast.show({
              icon: 'success',
              content: '保存成功'
            });
            onSubmit?.(res?.data);
          }
        });
      })
      .catch((error) => {
        if (error?.errorFields?.length) {
          const firstError = error.errorFields[0];
          JOJO.toast.show({
            icon: 'fail',
            content: firstError?.errors?.[0]
          });
        }
      });
  };

  /**
   * 防止输入空格
   * @param val
   * @param key
   */
  const preventSpace = (val: string | undefined, key: string) => {
    if (!val) return;

    if (/[\s\r\n]/g.test(val)) {
      const value = val.replace(/[\s\r\n]/g, '');
      form.setFieldsValue({ [key]: value });
    } else {
      form.setFieldsValue({ [key]: val });
    }
  };

  return (
    <div className={S.addressContainer}>
      <section className={S.formWrap}>
        <div className={S.formContent}>
          <Form form={form} layout='horizontal' initialValues={{ regionCode: ['+86'] }}>
            <Form.Item name='name' label='姓名' rules={[{ required: true, message: '请输入姓名' }]}>
              <Input maxLength={20} placeholder='请输入收货人姓名' />
            </Form.Item>
            <Form.Item label='联系电话'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Item
                  name='regionCode'
                  noStyle
                  rules={[{ required: true, message: '请选择区号' }]}>
                  <ZoneCodeInput />
                </Form.Item>

                <Form.Item
                  name='phone'
                  noStyle
                  rules={[
                    { required: true, message: '请输入手机号' },
                    {
                      validator: (_, val) => {
                        if (form.getFieldValue('regionCode')[0] === '+86') {
                          if (!val || /^1\d{10}$/.test(val)) return Promise.resolve();
                          return Promise.reject(new Error('手机号格式不正确'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <Input maxLength={11} placeholder='请输入手机号' />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item
              label='所在地区'
              name='area'
              rules={[{ required: true, message: '请选择所在地区' }]}>
              <AreaInput />
            </Form.Item>

            <Form.Item
              name='addressDetail'
              label='详细地址'
              rules={[{ required: true, message: '请输入详细地址' }]}>
              <TextArea
                placeholder='如小区、楼栋号、门牌号等…'
                onChange={(v) => preventSpace(v, 'addressDetail')}
                rows={4}
                maxLength={100}
              />
            </Form.Item>
          </Form>
        </div>
      </section>

      <div className={S.btnWrap}>
        <Button className={S.btn} onClick={submit}>
          保存
        </Button>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReactToPrint } from 'react-to-print';
import ReceiptTemplate from '@/components/receipt/design';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import axios from 'axios';
import ReceiptTable from '@/components/receipt/receiptTable';
import { toast } from 'react-toastify';
import useSubtotal from '@/lib/useSubtotal';

const ref = React.createRef();

const Receipt = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
    service: [],
    customFields: [
      { id: 1, customServiceTitle: '', customServicePrice: 0, qty: 1 },
    ],
    discount: 0,
    tax: 0,
    chairNo: 0,
  });

  const [nextId, setNextId] = useState(2);
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(false);
  const [isTaxEnabled, setIsTaxEnabled] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const handleSubmit = async (e) => {
    let {
      fullName,
      phone,
      address,
      email,
      service,
      customFields,
      discount,
      tax,
      chairNo,
    } = formData;
    const subTotal = useSubtotal(service, customFields, discount, tax);

    service = JSON.stringify(service);
    customFields = JSON.stringify(customFields);

    chairNo = chairNo.value;
    e.preventDefault();

    if (fullName && phone && address && service && customFields && chairNo) {
      await axios.post(`${import.meta.env.VITE_HOST}/api/v1/receipt/add`, {
        fullName,
        phone,
        address,
        email,
        service,
        customFields,
        subTotal,
        chairNo,
      });

      setFormData({
        fullName: '',
        phone: '',
        address: '',
        email: '',
        service: [],
        customFields: [
          { id: 1, customServiceTitle: '', customServicePrice: 0, qty: 1 },
        ],
        discount: 0,
        tax: 0,
        chairNo: 0,
      });

      handlePrint();
    } else {
      toast('Please Fill All Field');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCustomInputChange = (index, fieldName, e) => {
    const values = [...formData.customFields];
    values[index][fieldName] = e.target.value;

    setFormData({
      ...formData,
      customFields: values,
    });
  };

  const handleAddMore = () => {
    setFormData({
      ...formData,
      customFields: [
        ...formData.customFields,
        { id: nextId, customServiceTitle: '', customServicePrice: 0, qty: 1 },
      ],
    });
    setNextId((old) => old + 1);
  };

  const handleDelete = (index) => {
    const values = [...formData.customFields];
    values.splice(index, 1);
    setFormData({
      ...formData,
      customFields: values,
    });
  };

  const [serviceList, setServices] = useState([]);

  const fetchData = async () => {
    const data = await axios.get(
      `${import.meta.env.VITE_HOST}/api/v1/services/`
    );
    setServices(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  let outputArray = serviceList.map((item) => {
    return { value: item.id, label: item.title, price: item.price };
  });

  outputArray = [
    { value: 'custom', label: 'Custom', price: 0 },
    ...outputArray,
  ];

  return (
    <Tabs defaultValue='generate'>
      <TabsList>
        <TabsTrigger value='generate'>Generate Receipt</TabsTrigger>
        <TabsTrigger value='list'>List Receipt</TabsTrigger>
      </TabsList>
      <TabsContent value='generate'>
        <main>
          <h1 className='font-bold text-3xl uppercase mt-4 mb-4'>
            Customer Receipt
          </h1>
          <form>
            <div className='flex gap-x-8 mb-4'>
              <div className='flex-1'>
                <Label htmlFor='fullName'>Full Name</Label>
                <Input
                  name='fullName'
                  id='fullName'
                  type='text'
                  placeholder='Enter Full Name'
                  onChange={handleInputChange}
                  isrequired={true}
                  value={formData.fullName}
                />
              </div>
              <div className='flex-1'>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input
                  name='phone'
                  id='phone'
                  type='number'
                  placeholder='Enter Phone Number'
                  onChange={handleInputChange}
                  isrequired={true}
                  value={formData.phone}
                />
              </div>
            </div>

            <div className='flex gap-x-8 mb-4'>
              <div className='flex-1'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  name='email'
                  id='email'
                  type='email'
                  placeholder='Enter Email'
                  onChange={handleInputChange}
                  isrequired={true}
                  value={formData.email}
                />
              </div>
              <div className='flex-1'>
                <Label htmlFor='address'>Address</Label>
                <Input
                  name='address'
                  id='address'
                  type='text'
                  placeholder='Enter Address'
                  onChange={handleInputChange}
                  isrequired={true}
                  value={formData.address}
                />
              </div>
            </div>

            <div className='mb-4'>
              <Label htmlFor='service'>Select Service</Label>
              <Select
                isClearable={true}
                defaultValue={formData.service}
                value={formData.service}
                name='service'
                id='service'
                isMulti={true}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    service: [...e],
                  });
                }}
                options={outputArray}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    padding: '1px',
                  }),
                }}
              />
            </div>

            {formData.service.some((item) => item?.value == 'custom') && (
              <>
                {formData.customFields.map((field, idx) => {
                  return (
                    <div key={idx} className='mt-5 mb-2'>
                      <div className='flex gap-x-4 items-center'>
                        <Label className='bg-pink-300 px-3 py-2.5 rounded-md inline-block'>
                          Custom Service {idx + 1}
                        </Label>
                        <button
                          type='button'
                          onClick={() => handleDelete(idx)}
                          className='px-3 py-1 bg-pink-300 rounded-md'
                        >
                          Delete
                        </button>
                      </div>
                      <div className='flex gap-x-8 mb-4'>
                        <div className='flex-1'>
                          <Label
                            htmlFor={`customServiceTitle-${idx + 1}`}
                            className='inline-block'
                          >
                            Service Title
                          </Label>

                          <Input
                            name={`customServiceTitle-${idx + 1}`}
                            id={`customServiceTitle-${idx + 1}`}
                            type='text'
                            placeholder='Enter Title'
                            onChange={(e) => {
                              handleCustomInputChange(
                                idx,
                                'customServiceTitle',
                                e
                              );
                            }}
                            isrequired={true}
                            value={field.customServiceTitle}
                          />
                        </div>
                        <div className='flex-1'>
                          <Label htmlFor={`customServicePrice-${idx + 1}`}>
                            Price
                          </Label>
                          <Input
                            name={`customServicePrice-${idx + 1}`}
                            id={`customServicePrice-${idx + 1}`}
                            type='number'
                            placeholder='Enter Price'
                            onChange={(e) => {
                              handleCustomInputChange(
                                idx,
                                'customServicePrice',
                                e
                              );
                            }}
                            isrequired={true}
                            value={field.customServicePrice}
                          />
                        </div>
                        <div>
                          <div className='flex-1'>
                            <Label htmlFor={`qty-${idx + 1}`}>Quantity</Label>
                            <Input
                              name={`qty-${idx + 1}`}
                              id={`qty-${idx + 1}`}
                              type='number'
                              placeholder='Quantity'
                              onChange={(e) => {
                                handleCustomInputChange(idx, 'qty', e);
                              }}
                              isrequired={true}
                              value={field.qty}
                              min='1'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className='flex justify-end'>
                  <Button onClick={handleAddMore}>Add Custom Service</Button>
                </div>
              </>
            )}

            <div className='mb-4'>
              <Label htmlFor='chairNo'>Select Chair No.</Label>
              <Select
                isClearable={true}
                defaultValue={formData.chairNo}
                value={formData.chairNo}
                name='chairNo'
                id='chairNo'
                // isMulti={true}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    chairNo: e,
                  });
                }}
                options={[
                  { value: 1, label: 'Chair 1' },
                  { value: 2, label: 'Chair 2' },
                  { value: 3, label: 'Chair 3' },
                  { value: 4, label: 'Chair 4' },
                  { value: 5, label: 'Chair 5' },
                  { value: 6, label: 'Chair 6' },
                ]}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    padding: '1px',
                  }),
                }}
              />
            </div>
            <div className='mb-4 flex gap-x-8'>
              <div className='flex-1'>
                <div className='flex items-center '>
                  <Label htmlFor='isTax' className='mr-2 cursor-pointer'>
                    Tax?
                  </Label>
                  <input
                    name='isTax'
                    id='isTax'
                    type='checkbox'
                    placeholder='Tax'
                    onChange={(e) => {
                      setIsTaxEnabled((prev) => !prev);
                    }}
                    required={true}
                    value={isTaxEnabled}
                    className='cursor-pointer'
                  />
                </div>
                {isTaxEnabled && (
                  <div className='mt-2'>
                    <Label htmlFor='tax' className='mr-2'>
                      Tax Percentage
                    </Label>
                    <Input
                      name='tax'
                      id='tax'
                      type='number'
                      placeholder='Enter Value'
                      onChange={handleInputChange}
                      isrequired={true}
                      value={formData.tax}
                      min='0'
                    />
                  </div>
                )}
              </div>

              <div className='flex-1'>
                <div className='flex items-center'>
                  <Label htmlFor='isDiscount' className='mr-2 cursor-pointer'>
                    Discount?
                  </Label>
                  <input
                    name='isDiscount'
                    id='isDiscount'
                    type='checkbox'
                    placeholder='Discount'
                    onChange={(e) => {
                      setIsDiscountEnabled((prev) => !prev);
                    }}
                    required={true}
                    value={isDiscountEnabled}
                    className='cursor-pointer'
                  />
                </div>
                {isDiscountEnabled && (
                  <div className='mt-2'>
                    <Label htmlFor='discount' className='mr-2'>
                      Discount Percentage
                    </Label>
                    <Input
                      name='discount'
                      id='discount'
                      type='number'
                      placeholder='Enter Value'
                      onChange={handleInputChange}
                      isrequired={true}
                      value={formData.discount}
                      min='1'
                    />
                  </div>
                )}
              </div>
            </div>
            <Button
              type='submit'
              href='#'
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Print this out!
            </Button>
          </form>
          <div id='printable-component'>
            <ReceiptTemplate
              ref={ref}
              fieldValues={formData}
              outputArray={outputArray}
              isTaxEnabled={isTaxEnabled}
              isDiscountEnabled={isDiscountEnabled}
            />
          </div>
        </main>
      </TabsContent>
      <TabsContent value='list'>
        <ReceiptTable />
      </TabsContent>
    </Tabs>
  );
};

export default Receipt;

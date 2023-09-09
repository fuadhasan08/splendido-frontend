import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Pdf from 'react-to-pdf';
import ReceiptTemplate from '@/components/receipt/design';
import axios from 'axios';

const ref = React.createRef();

const Receipt = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
    service: [],
    customFields: [{ id: 1, customServiceTitle: '', customServicePrice: '' }],
  });

  const [nextId, setNextId] = useState(2);

  const handleSubmit = async (e, genPdf) => {
    let { fullName, phone, address, email, service, customFields } = formData;

    service = JSON.stringify(service);
    customFields = JSON.stringify(customFields);

    e.preventDefault();
    genPdf();

    await axios.post(`${import.meta.env.VITE_HOST}/api/v1/receipt/add`, {
      fullName,
      phone,
      address,
      email,
      service,
      customFields,
    });

    setFormData({
      fullName: '',
      phone: '',
      address: '',
      email: '',
      service: [],
      customFields: [{ id: 1, customServiceTitle: '', customServicePrice: 0 }],
    });
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
        { id: nextId, customServiceTitle: '', customServicePrice: 0 },
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
                          handleCustomInputChange(idx, 'customServiceTitle', e);
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
                          handleCustomInputChange(idx, 'customServicePrice', e);
                        }}
                        isrequired={true}
                        value={field.customServicePrice}
                      />
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

        <Pdf
          targetRef={ref}
          filename={`splendido-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.pdf`}
        >
          {({ toPdf }) => (
            <Button
              type='submit'
              onClick={(e) => {
                handleSubmit(e, toPdf);
              }}
            >
              Generate Pdf
            </Button>
          )}
        </Pdf>
      </form>
      <ReceiptTemplate
        ref={ref}
        fieldValues={formData}
        outputArray={outputArray}
      />
    </main>
  );
};

export default Receipt;

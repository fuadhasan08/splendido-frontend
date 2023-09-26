import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from 'react-select';

import axios from 'axios';
import { toast } from 'react-toastify';

const AddService = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
  });

  const handleSubmit = async (e) => {
    let { title, price, category } = formData;

    category = category.label;

    e.preventDefault();

    await axios.post(`${import.meta.env.VITE_HOST}/api/v1/services/add`, {
      title,
      price,
      category,
    });

    toast('Added');

    setFormData({
      title: '',
      price: '',
      category: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <main>
      <h1 className='font-bold text-3xl uppercase mt-4 mb-4'>Add Services</h1>
      <form>
        <div className='flex gap-x-8 mb-4'>
          <div className='flex-1'>
            <Label htmlFor={`title`} className='inline-block'>
              Service Title
            </Label>

            <Input
              name={`title`}
              id={`title`}
              type='text'
              placeholder='Enter Title'
              onChange={handleInputChange}
              isrequired={true}
              value={formData.title}
            />
          </div>
          <div className='flex-1'>
            <Label htmlFor={`price`}>Price</Label>
            <Input
              name={`price`}
              id={`price`}
              type='number'
              placeholder='Enter Price'
              onChange={handleInputChange}
              isrequired={true}
              value={formData.price}
            />
          </div>
          <div className='flex-1'>
            <Label htmlFor={`category`}>Category</Label>
            <Select
              isClearable={true}
              defaultValue={formData.category}
              value={formData.category}
              name='category'
              id='category'
              onChange={(e) => {
                setFormData({
                  ...formData,
                  category: e,
                });
              }}
              options={[
                { label: 'Hair Cut', value: 1 },
                { label: 'Hair Color', value: 2 },
                { label: 'Hair Treatment', value: 3 },
                { label: 'Rebonding & Straight', value: 4 },
                { label: 'Package-1', value: 5 },
                { label: 'Package-2', value: 6 },
                { label: 'Package-3', value: 7 },
                { label: 'Package-4', value: 8 },
                { label: 'Face Wash & Fair Polish', value: 9 },
                { label: 'Pedicure & Manicure', value: 10 },
                { label: 'Facial - Skin Care', value: 11 },
                { label: 'Grooming Zone', value: 12 },
                { label: 'Grooming Offer', value: 13 },
                { label: 'Student Package-1', value: 14 },
                { label: 'Student Package-2', value: 15 },
                { label: 'Body Massage', value: 16 },
              ]}
            />
          </div>
        </div>

        <Button
          type='submit'
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Add
        </Button>
      </form>
    </main>
  );
};

export default AddService;

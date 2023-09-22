import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import axios from 'axios';
import { toast } from 'react-toastify';

const AddService = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
  });

  const handleSubmit = async (e) => {
    let { title, price } = formData;

    e.preventDefault();

    await axios.post(
      `https://splendido-apiv1.onrender.com/api/v1/services/add`,
      {
        title,
        price,
      }
    );

    toast('Added');

    setFormData({
      title: '',
      price: '',
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

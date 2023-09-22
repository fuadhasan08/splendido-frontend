import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import FilteredTable from '../ui/FilteredTable';
import { AiFillDelete } from 'react-icons/ai';

const ServiceTable = () => {
  const [serviceList, setServices] = useState([]);

  const fetchData = async () => {
    const data = await axios.get(
      `https://splendido-apiv1.onrender.com/api/v1/services/`
    );
    setServices(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const conf = confirm('Are you sure?');
    if (conf) {
      await axios.post(`https://splendido-apiv1.onrender.com/api/v1/services/delete`, {
        id,
      });
      fetchData();
      toast(`Service with id:${id} Deleted`);
    } else {
      toast(`Operation cancelled`);
    }
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'price',
      header: 'Price',
    },
    {
      accessorKey: '',
      header: 'Delete',
      cell: ({ row }) => {
        const id = parseFloat(row.getValue('id'));

        return (
          <AiFillDelete
            onClick={() => handleDelete(id)}
            className='cursor-pointer text-pink-600'
          />
        );
      },
    },
  ];

  return <FilteredTable columns={columns} data={serviceList} />;
};

export default ServiceTable;

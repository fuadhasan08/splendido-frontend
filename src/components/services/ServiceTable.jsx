import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Input } from '../ui/input';
import axios from 'axios';

import { toast } from 'react-toastify';

const ServiceTable = () => {
  const [filtering, setFiltering] = useState('');

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

  const handleClick = async (id) => {
    await axios.post(`${import.meta.env.VITE_HOST}/api/v1/services/delete`, {
      id,
    });
    fetchData();
    toast(`Service with id:${id} Deleted`);
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
          <div className='' onClick={() => handleClick(id)}>
            {id}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: serviceList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className='rounded-md'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter emails...'
          value={filtering}
          onChange={(event) => setFiltering(event.target.value)}
          className='max-w-sm'
        />
      </div>
      {console.log(serviceList)}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceTable;

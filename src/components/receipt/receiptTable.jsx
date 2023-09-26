import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import FilteredTable from '../ui/FilteredTable';
import { AiFillPrinter, AiFillDelete } from 'react-icons/ai';
import { useReactToPrint } from 'react-to-print';
import ReceiptTemplate from './designv2';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const ReceiptTable = () => {
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [receiptList, setReceiptList] = useState([]);
  const [chairNoFilter, setChairNoFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState(getCurrentDate()); // Add this line
  const [endDateFilter, setEndDateFilter] = useState(getCurrentDate()); // Add this line

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_HOST}/api/v1/receipt?chairNo=${chairNoFilter}&startDate=${startDateFilter}&endDate=${endDateFilter}`
      )
      .then((response) => {
        setReceiptList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [chairNoFilter, startDateFilter, endDateFilter]);

  // const handleDelete = async (id) => {
  //   const conf = confirm('Are you sure?');
  //   if (conf) {
  //     await axios.post(`${import.meta.env.VITE_HOST}/api/v1/receipt/delete`, {
  //       id,
  //     });
  //     fetchData();
  //     toast(`Receipt with id:${id} Deleted`);
  //   } else {
  //     toast(`Operation cancelled`);
  //   }
  // };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'services',
      header: 'Services',
      cell: ({ row }) => {
        let services = row.getValue('services');
        services = JSON.parse(services);

        const mergedTitles = services.reduce((titleString, obj, index) => {
          if (obj.label !== undefined && obj.label !== 'Custom') {
            if (index !== 0) {
              titleString += ', ';
            }
            titleString += obj.label;
          }
          return titleString;
        }, '');

        return <p>{mergedTitles}</p>;
      },
    },
    {
      accessorKey: 'customFields',
      header: 'Custom Services',
      cell: ({ row }) => {
        let customFields = row.getValue('customFields');
        customFields = JSON.parse(customFields);

        const mergedTitles = customFields.reduce((titleString, obj, index) => {
          if (obj.customServiceTitle !== '') {
            if (index !== 0) {
              titleString += ', ';
            }
            titleString += obj.customServiceTitle;
          } else {
            titleString = 'none';
          }
          return titleString;
        }, '');

        return <p>{mergedTitles}</p>;
      },
    },
    {
      accessorKey: 'subtotal',
      header: 'Subtotal',
    },
    {
      accessorKey: 'chairNo',
      header: 'Chair',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        let date = row.getValue('date');
        let formatedDate = moment(date).format('lll');

        return <p>{formatedDate}</p>;
      },
    },
    {
      accessorKey: '',
      header: 'Print',
      cell: ({ row }) => {
        const ref = React.createRef();

        const handlePrint = useReactToPrint({
          content: () => ref.current,
        });

        const id = parseFloat(row.getValue('id'));
        const filteredReceipt = receiptList.filter(
          (receipt) => receipt.id == id
        );

        return (
          <>
            <div onClick={() => handlePrint()}>
              <AiFillPrinter className='cursor-pointer text-pink-600' />
            </div>
            <div className='hidden'>
              <ReceiptTemplate ref={ref} fieldValues={filteredReceipt[0]} />
            </div>
          </>
        );
      },
    },
    // {
    //   accessorKey: '',
    //   header: 'Delete',
    //   cell: ({ row }) => {
    //     const id = parseFloat(row.getValue('id'));

    //     return (
    //       <AiFillDelete
    //         onClick={() => handleDelete(id)}
    //         className='cursor-pointer text-pink-600'
    //       />
    //     );
    //   },
    // },
  ];

  const subTotalIncome = receiptList.reduce((accumulator, currentItem) => {
    return accumulator + parseInt(currentItem.subtotal);
  }, 0);

  return (
    <>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold mt-6 mb-2'>Filter Receipts</h2>

          <div className='flex space-x-5 my-3'>
            <div>
              <Label>Select Start Date</Label>
              <input
                type='date'
                placeholder='Start Date'
                value={startDateFilter}
                onChange={(e) => {
                  setStartDateFilter(e.target.value);
                }}
                className='w-full mt-2 p-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
            <div>
              <Label>Select End Date</Label>
              <input
                type='date'
                placeholder='End Date'
                value={endDateFilter}
                onChange={(e) => {
                  setEndDateFilter(e.target.value);
                  setViewAllFilter(true);
                }}
                className='w-full mt-2 p-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
          </div>
          {/* <div className='flex flex-col space-y-2 my-5'>
            <label className='cursor-pointer flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={todayFilter}
                onChange={() => setTodayFilter(!todayFilter)}
                className='form-checkbox h-5 w-5 text-indigo-600 rounded'
              />
              <span className='text-gray-900'>Show Today's Receipt</span>
            </label>
            <label className='cursor-pointer flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={viewAllFilter}
                onChange={() => setViewAllFilter(!viewAllFilter)}
                className='form-checkbox h-5 w-5 text-indigo-600 rounded'
              />
              <span className='text-gray-900'>View All Receipt</span>
            </label>
          </div> */}

          <div>
            <Label htmlFor='discount' className='mr-2'>
              Filter by Chair
              <Input
                type='text'
                placeholder='Enter chair number'
                value={chairNoFilter}
                onChange={(e) => setChairNoFilter(e.target.value)}
              />
            </Label>
          </div>
        </div>
        <div className='m-5 p-5 shadow-md inline-block text-center'>
          <h2 className='text-2xl font-bold text-green-600'>Total Revenue</h2>
          <h2 className='text-2xl font-bold'>{subTotalIncome}/-</h2>
        </div>
      </div>
      <FilteredTable columns={columns} data={receiptList} />
    </>
  );
};

export default ReceiptTable;

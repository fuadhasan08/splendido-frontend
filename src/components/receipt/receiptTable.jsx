import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import FilteredTable from '../ui/FilteredTable';

const ReceiptTable = () => {
  const [receiptList, setReceiptList] = useState([]);

  const fetchData = async () => {
    const data = await axios.get(
      `https://splendido-apiv1.onrender.com/api/v1/receipt`
    );
    setReceiptList(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: 'fullName',
      header: 'Name',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => {
        let phone = row.getValue('phone');

        return <a href={`tel:${phone}`}>{phone}</a>;
      },
    },
    // {
    //   accessorKey: 'address',
    //   header: 'Address',
    // },
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
  ];

  return <FilteredTable columns={columns} data={receiptList} />;
};

export default ReceiptTable;

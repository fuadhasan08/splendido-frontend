import useSubtotal from '@/lib/useSubtotal';
import React from 'react';
import moment from 'moment';
import { StretchVerticalIcon } from 'lucide-react';

const ReceiptTemplate = React.forwardRef(({ fieldValues }, ref) => {
  let {
    fullName,
    phone,
    address,
    email,
    services,
    customFields,
    discount,
    tax,
    chairNo,
  } = fieldValues;

  services = JSON.parse(services);
  customFields = JSON.parse(customFields);

  const subTotal = useSubtotal(services, customFields, discount, tax);

  return (
    <div id='invoice-POS' className='font-fira' ref={ref}>
      <center id='top'>
        <div className='logo'>
          <img src='https://i.ibb.co/Hpcnkyj/logo-bh.png' alt='' />
        </div>
        <div className='info'>
          <h2>Splendido Ishwarganj</h2>
        </div>
      </center>

      <div id='mid'>
        <div className='info'>
          <h2>Customer Info</h2>
          <p>
            {fullName && <span className='block'>Name: {fullName}</span>}
            {address && <span className='block'>Address: {address}</span>}
            {phone && <span className='block'>Phone: {phone}</span>}
            {email && <span className='block'>Email: {email}</span>}
            {chairNo && <span className='block'>Chair No: {chairNo}</span>}
          </p>
        </div>
      </div>

      <div id='bot'>
        <div id='table'>
          <table>
            <thead>
              <tr className='tabletitle'>
                <td className='item'>
                  <h2>Item</h2>
                </td>

                <td className='Rate'>
                  <h2>Sub Total</h2>
                </td>
              </tr>
            </thead>

            <tbody>
              {services &&
                services
                  .filter((item) => item.value !== 'custom')
                  .map((serv, idx) => {
                    if (serv.value !== 'custom') {
                      return (
                        <tr className='service' key={idx}>
                          <td className='tableitem'>
                            <p className='itemtext'>{serv.label}</p>
                          </td>

                          <td className='tableitem'>
                            <p className='itemtext'>{serv.price}</p>
                          </td>
                        </tr>
                      );
                    }
                  })}

              {services && services.some((item) => item?.value == 'custom') && (
                <>
                  {customFields.map((field) => {
                    const { id, customServiceTitle, customServicePrice, qty } =
                      field;
                    return (
                      <tr className='service' key={id}>
                        <td className='tableitem'>
                          <p className='itemtext'>
                            {Math.abs(qty) == 1
                              ? customServiceTitle
                              : `${customServiceTitle} x ${Math.abs(qty)}`}
                          </p>
                        </td>
                        <td className='tableitem'>
                          <p className='itemtext'>
                            {customServicePrice * Math.abs(qty)}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
              {tax > 0 && (
                <tr className='tabletitle'>
                  <td className='Rate'>
                    <h2>Tax</h2>
                  </td>
                  <td className='payment'>
                    <h2>{tax}% </h2>
                  </td>
                </tr>
              )}
              {discount > 0 && (
                <tr className='tabletitle'>
                  <td className='Rate'>
                    <h2>Discount</h2>
                  </td>
                  <td className='payment'>
                    <h2>{discount}% </h2>
                  </td>
                </tr>
              )}
              <tr className='tabletitle'>
                <td className='Rate'>
                  <h2>Total</h2>
                </td>
                <td className='payment'>
                  <h2>{subTotal} </h2>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id='legalcopy'>
          <p className='legal'>
            <strong>
              Payment successful. Thank you for being with splendido!
            </strong>
            <br />
            <br />
          </p>
        </div>
      </div>
      <p className='text-center !text-[8px] mt-1'>
        Printed on {moment().format('llll')}
      </p>
    </div>
  );
});

export default ReceiptTemplate;

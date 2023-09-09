import React from 'react';

const ReceiptTemplate = React.forwardRef(({ fieldValues }, ref) => {
  const { fullName, phone, address, email, service, customFields } =
    fieldValues;

  const serviceSubtotal =
    service.length > 0 ? service.reduce((acc, prev) => acc + prev.price, 0) : 0;

  const arrayOfPrices = customFields.map((obj) =>
    parseInt(obj.customServicePrice)
  );

  const customFieldsSubtotal =
    arrayOfPrices.length > 1
      ? arrayOfPrices.reduce((total, price) => total + price, 0)
      : 0;

  const subTotal = parseInt(serviceSubtotal) + customFieldsSubtotal;

  return (
    <div id='invoice-POS' className='font-fira' ref={ref}>
      <center id='top'>
        <div className='logo'></div>
        <div className='info'>
          <h2>Splendido Ishwarganj</h2>
        </div>
      </center>

      <div id='mid'>
        <div className='info'>
          <h2>Contact Info</h2>
          <p>
            {fullName && `Name: ${fullName}`}
            <br />
            {address && `Address: ${address}`}
            <br />
            {phone && `Phone: ${phone}`}
            <br />
            {email && `Email: ${email}`}
            <br />
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
                <td className='Hours'>
                  <h2>Qty</h2>
                </td>
                <td className='Rate'>
                  <h2>Sub Total</h2>
                </td>
              </tr>
            </thead>

            <tbody>
              {service
                .filter((item) => item.value !== 'custom')
                .map((serv, idx) => {
                  if (serv.value !== 'custom') {
                    return (
                      <tr className='service' key={idx}>
                        <td className='tableitem'>
                          <p className='itemtext'>{serv.label}</p>
                        </td>
                        <td className='tableitem'>
                          <p className='itemtext'>1</p>
                        </td>
                        <td className='tableitem'>
                          <p className='itemtext'>{serv.price}</p>
                        </td>
                      </tr>
                    );
                  }
                })}

              {service.some((item) => item?.value == 'custom') && (
                <>
                  {customFields.map((field) => {
                    const { id, customServiceTitle, customServicePrice } =
                      field;
                    return (
                      <tr className='service' key={id}>
                        <td className='tableitem'>
                          <p className='itemtext'>{customServiceTitle}</p>
                        </td>
                        <td className='tableitem'>
                          <p className='itemtext'>1</p>
                        </td>
                        <td className='tableitem'>
                          <p className='itemtext'>{customServicePrice}</p>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}

              <tr className='tabletitle'>
                <td></td>
                <td className='Rate'>
                  <h2>Total</h2>
                </td>
                <td className='payment'>
                  <h2>{parseInt(subTotal)} </h2>
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
    </div>
  );
});

export default ReceiptTemplate;

interface IOrderCancelled {
  orderId: string;
  orderAt: string; //Date
  orderItems: IOrderItem[];
  totalPrice: number;
  shippingPrice: number;
  billingAddress: IAddress;
  shippingAddress: IAddress;
  user: IUser;
  subject: string;
  message: string;
  paymentMethod: string;
}

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface IAddress {
  address: string;
  townCity: string;
  postalCode: string;
  country: string;
  companyName: string;
}

interface IOrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
  accessories: IAccessories;
}

interface IAccessories {
  size: {
    name: string;
  };
  headboard: {
    name: string;
  };
  mattress: {
    name: string;
  };
  color: {
    name: string;
  };
  storage: {
    name: string;
  };
  feet: {
    name: string;
  };
}

export const orderStatusTemplate = ({
  orderId,
  orderAt,
  orderItems,
  totalPrice,
  shippingPrice,
  billingAddress,
  shippingAddress,
  user,
  message,
  subject,
  paymentMethod,
}: IOrderCancelled) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Cancelled</title>
      </head>
      <body style="width: max-content; margin: auto; border: 1px solid #e5e5e5">
        <div>
          <table
            cellpadding="0"
            cellspacing="0"
            width="100%"
            id="m_5525788641604108479m_5893421084685921433template_container"
            style="
              background-color: #fff;
              border: 1px solid #dedede;
              border-radius: 3px;
              background-color: #fff;
              border: 0;
            "
          >
            <tbody>
              <tr style="border-color: inherit">
                <td halign="center" valign="top">
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    id="m_5525788641604108479m_5893421084685921433template_header"
                    style="
                      background-color: #7f54b3;
                      color: #fff;
                      border-bottom: 0;
                      font-weight: bold;
                      line-height: 100%;
                      vertical-align: middle;
                      font-family: 'Helvetica Neue', Helvetica, Roboto, Arial,
                        sans-serif;
                      border-radius: 3px 3px 0 0;
                    "
                  >
                    <tbody>
                      <tr>
                        <td
                          id="m_5525788641604108479m_5893421084685921433header_wrapper"
                          style="padding: 36px 48px; display: block"
                        >
                          <h1
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Roboto,
                                Arial, sans-serif;
                              font-size: 30px;
                              font-weight: 300;
                              line-height: 150%;
                              margin: 0;
                              text-align: left;
                              color: #fff;
                              background-color: inherit;
                            "
                          >
                            ${subject}: #${orderId}
                          </h1>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td halign="center" valign="top">
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="600"
                    id="m_5525788641604108479m_5893421084685921433template_body"
                  >
                    <tbody>
                      <tr>
                        <td
                          valign="top"
                          id="m_5525788641604108479m_5893421084685921433body_content"
                          style="background-color: #fff"
                          bgcolor="#fff"
                        >
                          <table cellpadding="20" cellspacing="0" width="100%">
                            <tbody>
                              <tr>
                                <td valign="top" style="padding: 48px 48px 32px">
                                  <div
                                    id="m_5525788641604108479m_5893421084685921433body_content_inner"
                                    style="
                                      color: #636363;
                                      font-family: 'Helvetica Neue', Helvetica,
                                        Roboto, Arial, sans-serif;
                                      font-size: 14px;
                                      line-height: 150%;
                                      text-align: left;
                                    "
                                  >
                                    <p style="margin: 0 0 16px">
                                     ${message}
                                    </p>
    
                                    <h2
                                      style="
                                        color: #7f54b3;
                                        display: block;
                                        font-family: 'Helvetica Neue', Helvetica,
                                          Roboto, Arial, sans-serif;
                                        font-size: 18px;
                                        font-weight: bold;
                                        line-height: 130%;
                                        margin: 0 0 18px;
                                        text-align: left;
                                      "
                                    >
                                      <a
                                        href="https://www.bedsdivans.co.uk/wp-admin/post.php?post=87361&amp;action=edit"
                                        style="
                                          font-weight: normal;
                                          text-decoration: underline;
                                          color: #7f54b3;
                                        "
                                        target="_blank"
                                        data-saferedirecturl="https://www.google.com/url?q=https://www.bedsdivans.co.uk/wp-admin/post.php?post%3D87361%26action%3Dedit&amp;source=gmail&amp;ust=1667981623532000&amp;usg=AOvVaw3OA-NTaL1i9wGNeN9mm_rU"
                                        >[Order #${orderId}]</a
                                      >
                                      (${orderAt})
                                    </h2>
    
                                    <div style="margin-bottom: 40px">
                                      <table
                                        cellspacing="0"
                                        cellpadding="6"
                                        style="
                                          color: #636363;
                                          border: 1px solid #e5e5e5;
                                          vertical-align: middle;
                                          width: 100%;
                                          font-family: 'Helvetica Neue', Helvetica,
                                            Roboto, Arial, sans-serif;
                                        "
                                        width="100%"
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              scope="col"
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                              "
                                            >
                                              Product
                                            </th>
                                            <th
                                              scope="col"
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                              "
                                            >
                                              Quantity
                                            </th>
                                            <th
                                              scope="col"
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                              "
                                            >
                                              Price
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          ${orderItems.map((item) => {
                                            return ` <tr>
                                            <td
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                padding: 12px;
                                                text-align: left;
                                                vertical-align: middle;
                                                font-family: 'Helvetica Neue',
                                                  Helvetica, Roboto, Arial,
                                                  sans-serif;
                                                word-wrap: break-word;
                                              "
                                            >
                                            ${item.name}
                                              <ul
                                                style="
                                                  font-size: small;
                                                  margin: 1em 0 0;
                                                  padding: 0;
                                                  list-style: none;
                                                "
                                              >
                                                <li
                                                  style="
                                                    margin: 0.5em 0 0;
                                                    padding: 0;
                                                  "
                                                >
                                                  <strong
                                                    style="
                                                      float: left;
                                                      margin-right: 0.25em;
                                                      clear: both;
                                                    "
                                                    >Choose Colour:</strong
                                                  >
                                                  <p style="margin: 0">
                                                    ${
                                                      item?.accessories?.color
                                                        ?.name || "No Color"
                                                    }
                                                  </p>
                                                </li>
                                                <li
                                                  style="
                                                    margin: 0.5em 0 0;
                                                    padding: 0;
                                                  "
                                                >
                                                  <strong
                                                    style="
                                                      float: left;
                                                      margin-right: 0.25em;
                                                      clear: both;
                                                    "
                                                    >Select Your Size:</strong
                                                  >
                                                  <p style="margin: 0">
                                                  ${
                                                    item?.accessories?.size
                                                      ?.name || "No Size"
                                                  }
                                                  </p>
                                                </li>
                                                <li
                                                  style="
                                                    margin: 0.5em 0 0;
                                                    padding: 0;
                                                  "
                                                >
                                                  <strong
                                                    style="
                                                      float: left;
                                                      margin-right: 0.25em;
                                                      clear: both;
                                                    "
                                                    >Select Your Feet:</strong
                                                  >
                                                  <p style="margin: 0">
                                                    ${
                                                      item?.accessories?.feet
                                                        ?.name || "No Feet"
                                                    }
                                                  </p>
                                                </li>
                                                <li
                                                  style="
                                                    margin: 0.5em 0 0;
                                                    padding: 0;
                                                  "
                                                >
                                                  <strong
                                                    style="
                                                      float: left;
                                                      margin-right: 0.25em;
                                                      clear: both;
                                                    "
                                                    >Select Your Headboard:</strong
                                                  >
                                                  <p style="margin: 0">
                                                    ${
                                                      item?.accessories
                                                        ?.headboard?.name ||
                                                      "No Headboard"
                                                    }
                                                  </p>
                                                </li>
                                                <li
                                                  style="
                                                    margin: 0.5em 0 0;
                                                    padding: 0;
                                                  "
                                                >
                                                  <strong
                                                    style="
                                                      float: left;
                                                      margin-right: 0.25em;
                                                      clear: both;
                                                    "
                                                    >Select Your Mattress:</strong
                                                  >
                                                  <p style="margin: 0">
                                                    ${
                                                      item?.accessories
                                                        ?.mattress?.name ||
                                                      "No Mattress"
                                                    }
                                                  </p>
                                                </li>
                                              </ul>
                                            </td>
                                            <td
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                padding: 12px;
                                                text-align: left;
                                                vertical-align: middle;
                                                font-family: 'Helvetica Neue',
                                                  Helvetica, Roboto, Arial,
                                                  sans-serif;
                                              "
                                            >
                                              ${item.quantity}
                                            </td>
                                            <td
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                padding: 12px;
                                                text-align: left;
                                                vertical-align: middle;
                                                font-family: 'Helvetica Neue',
                                                  Helvetica, Roboto, Arial,
                                                  sans-serif;
                                              "
                                            >
                                              <span><span>£</span>${
                                                item.price
                                              }</span>
                                            </td>
                                          </tr>`;
                                          })}
    
                                         
                                        </tbody>
                                        <tfoot>
                                          <tr>
                                            <th
                                              scope="row"
                                              colspan="2"
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                                border-top-width: 4px;
                                              "
                                            >
                                              Subtotal:
                                            </th>
                                            <td
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                                border-top-width: 4px;
                                              "
                                            >
                                              <span><span>£</span>${totalPrice}</span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <th
                                              scope="row"
                                              colspan="2"
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                              "
                                            >
                                              Shipping:
                                            </th>
                                            <td
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                              "
                                            >
                                              ${
                                                shippingPrice
                                                  ? `<span><span>£</span>${shippingPrice}</span>`
                                                  : "Free Shipping"
                                              }
                                            </td>
                                          </tr>
                                          <tr>
                                            <th
                                              scope="row"
                                              colspan="2"
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                              "
                                            >
                                              Payment method:
                                            </th>
                                            <td
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                              "
                                            >
                                              ${paymentMethod}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th
                                              scope="row"
                                              colspan="2"
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                              "
                                            >
                                              Total:
                                            </th>
                                            <td
                                              style="
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                                vertical-align: middle;
                                                padding: 12px;
                                                text-align: left;
                                              "
                                            >
                                              <span><span>£</span>${totalPrice}</span>
                                            </td>
                                          </tr>
                                        </tfoot>
                                      </table>
                                    </div>
    
                                    <table
                                      id="m_5525788641604108479m_5893421084685921433addresses"
                                      cellspacing="0"
                                      cellpadding="0"
                                      style="
                                        width: 100%;
                                        vertical-align: top;
                                        margin-bottom: 40px;
                                        padding: 0;
                                        border: 0;
                                      "
                                      width="100%"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            valign="top"
                                            width="50%"
                                            style="
                                              text-align: left;
                                              font-family: 'Helvetica Neue',
                                                Helvetica, Roboto, Arial, sans-serif;
                                              border: 0;
                                              padding: 0;
                                            "
                                          >
                                            <h2
                                              style="
                                                color: #7f54b3;
                                                display: block;
                                                font-family: 'Helvetica Neue',
                                                  Helvetica, Roboto, Arial,
                                                  sans-serif;
                                                font-size: 18px;
                                                font-weight: bold;
                                                line-height: 130%;
                                                margin: 0 0 18px;
                                                text-align: left;
                                              "
                                            >
                                              Billing address
                                            </h2>
    
                                            <address
                                              style="
                                                padding: 12px;
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                              "
                                            >
                                              ${
                                                billingAddress.companyName
                                              }<br />${user.firstName} ${
    user.lastName
  }<br />${billingAddress.address}<br />${billingAddress.townCity}<br />${
    billingAddress.postalCode
  }<br />${billingAddress.country}<br />
                                              <a
                                                href="tel:${user.phone}"
                                                style="
                                                  color: #7f54b3;
                                                  font-weight: normal;
                                                  text-decoration: underline;
                                                "
                                                target="_blank"
                                                >${user.phone}</a
                                              >
                                              <br /><a
                                                href="mailto:${user.email}"
                                                target="_blank"
                                                > ${user.email}</a
                                              >
                                            </address>
                                          </td>
                                          <td
                                            valign="top"
                                            width="50%"
                                            style="
                                              text-align: left;
                                              font-family: 'Helvetica Neue',
                                                Helvetica, Roboto, Arial, sans-serif;
                                              padding: 0;
                                            "
                                          >
                                            <h2
                                              style="
                                                color: #7f54b3;
                                                display: block;
                                                font-family: 'Helvetica Neue',
                                                  Helvetica, Roboto, Arial,
                                                  sans-serif;
                                                font-size: 18px;
                                                font-weight: bold;
                                                line-height: 130%;
                                                margin: 0 0 18px;
                                                text-align: left;
                                              "
                                            >
                                              Shipping address
                                            </h2>
    
                                            <address
                                              style="
                                                padding: 12px;
                                                color: #636363;
                                                border: 1px solid #e5e5e5;
                                              "
                                            >
                                              ${
                                                shippingAddress.companyName
                                              }<br />${user.firstName} ${
    user.lastName
  }<br />${shippingAddress.address}<br />${shippingAddress.townCity}<br />${
    shippingAddress.postalCode
  }<br />${shippingAddress.country}<br />
                                              <a
                                                href="tel:${user.phone}"
                                                style="
                                                  color: #7f54b3;
                                                  font-weight: normal;
                                                  text-decoration: underline;
                                                "
                                                target="_blank"
                                                >${user.phone}</a
                                              >
                                              <br /><a
                                                href="mailto:${user.email}"
                                                target="_blank"
                                                > ${user.email}</a
                                              >
                                            </address>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <p style="margin: 0 0 16px">
                                      Thanks for reading.
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>
    
`;
};

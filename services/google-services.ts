import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const merchant_ID = "523342500";
const feed_Name = "test";

const CLIENT_ID =
  "659926905568-8hji44m9je4ankkel25bfilo82qfrpmj.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04IwCF_hbdy9RCgYIARAAGAQSNwF-L9IrcrxpkkLp0n8uybrvwShb0whDERueLe3TND1LFsfHX-96qFfYxwuh3K4SfT18NRr1uNs";

const authClient = new OAuth2Client({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

authClient.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const merchantCenter = google.content({
  version: "v2.1",
  auth: authClient,
});

export const listProductItems = async () => {
  return await merchantCenter.products.custombatch({
    requestBody: {
      entries: [
        {
          batchId: 2222,
          merchantId: "523342500",
          method: "insert",
          product: {
            kind: "content#product",
            offerId: "2222",
            title:
              "Grey Linen Divan Bed Base or Set Headboard & Mattress Free Uk Delivery",
            description: `Variety of colours available in many different fabrics`,
            channel: "online",
            price: {
              value: "102",
              currency: "GBP",
            },
            sizes: ["2FT 6″ – Small Single "],
            availability: "in stock",
            brand: "bedsdivans",
            color: "Grey Linen",
            // condition: "new",
            // gender: "male",
            contentLanguage: "en",
            targetCountry: "UK",
            link: "https://bedsdivans.co.uk/product/modern-grey-divan-bed",
            imageLink:
              "https://api1.bedsdivans.co.uk/api/beds-image/red-1674043360824.webp",
            mobileLink:
              "https://bedsdivans.co.uk/product/modern-grey-divan-bed",
          },
        },
      ],
    },
  });
};

// Use the merchantCenter object to interact with the Google Merchant Center API

// product: {
//     kind: "content#product",
//     offerId: "1111111111",
//     title: "Google Tee Black",
//     description: `The Black Google Tee is available in unisex sizing and
//     features a retail fit.`,
//     link: "http://my.site.com/blacktee/",
//     imageLink: "https://shop.example.com/.../images/GGOEGXXX1100.jpg",
//     contentLanguage: "en",
//     targetCountry: "US",
//     feedLabel: "US",
//     channel: "online",
//     ageGroup: "adult",
//     availability: "in stock",
//     availabilityDate: "2019-01-25T13:00:00-08:00",
//     brand: "Google",
//     color: "black",
//     condition: "new",
//     gender: "male",
//     googleProductCategory: "1604",
//     gtin: "608802531656",
//     itemGroupId: "google_tee",
//     mpn: "608802531656",
//     price: {
//       value: "21.99",
//       currency: "USD",
//     },
//     sizes: ["Large"],
//     includedDestination: ["Shopping"],
//   },

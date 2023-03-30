import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

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

type ProductType = {
  batchId: number;
  title: string;
  description: string;
  price: {
    value: string;
    currency: string;
  };
  sizes: string[];
  color: string;
  link: string;
  imageLink: string;
  mobileLink: string;
};

export const insertDataToMerchant = async (productData: ProductType) => {
  const staticData = {
    kind: "content#product",
    offerId: "2222",
    channel: "online",
    availability: "in stock",
    brand: "bedsdivans",
    contentLanguage: "en",
    targetCountry: "UK",
  };
  return await merchantCenter.products.custombatch({
    requestBody: {
      entries: [
        {
          merchantId: "523342500",
          batchId: productData.batchId,
          method: "insert",
          product: {
            ...staticData,
            // Dynamic Data
            title: productData.title,
            description: productData.description,
            price: productData.price,
            sizes: productData.sizes,
            color: productData.color,
            link: productData.link,
            imageLink: productData.imageLink,
            mobileLink: productData.mobileLink,
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

// examples/Forms/ProductForm.jsx
import { notification } from "antd";
import { useEffect, useState } from "react";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDInput from "../../components/MDInput";
import MDSelect from "../../components/MDSelect/MDSelect";
import ProductService from "../../services/product-service.js";
// import FileUpload from "react-material-file-upload";
function ProductForm({ onClose, initialProduct }) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [actionName, setActionName] = useState("Create");
  const [productImage, setProductImage] = useState("");

  const categories = [
    "Fruits & Vegetables",
    "Dairy, Bread & Eggs",
    "Snacks & Munchies",
    "Bakery & Biscuits",
    "Breakfast & Instant Food",
    "Tea, Coffee & Health Drink",
    "Cold Drinks & Juices",
    "Sweet Tooth",
    "Atta, Rice & Dai",
    "Masala, Oil & More",
    "Sauces & Spreads",
    "Chicken, Meat & Fish",
    "Organic & Healthy Living",
    "Paan Corner",
    "Baby Care",
    "Pharma & Wellness",
    "Cleaning Essentials",
    "Home & Office",
    "Personal Care",
    "Pet Care"
  ];

  useEffect(() => {
    if (initialProduct) {
      setActionName("Update");
      setProductName(initialProduct.name || "");
      setProductDescription(initialProduct.description || "");
      setProductPrice(initialProduct.price || "");
      setProductQuantity(initialProduct.quantity || "");
      setProductCategory(initialProduct.category || "");
    }
  }, [initialProduct]);

  const handleSubmit = async (e) => {
    // e.preventDefault();

    // Create a FormData object to append both the product data and the image file
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("quantity", productQuantity);
    formData.append("category", productCategory);
    formData.append("price", parseFloat(productPrice));

    try {
      if (initialProduct) {
        productImage.forEach((file, index) => {
          formData.append(`images`, file);
        });
        // If initialProduct exists, update the existing product
        const response = await ProductService.update(
          initialProduct._id,
          formData
        );
        console.log("Product updated successfully:", response);
      } else {
        if (
          !productName ||
          !productDescription ||
          !productQuantity ||
          !productCategory ||
          !productPrice
        ) {
          notification.error({
            message: "Please input all fields.",
          });
          return;
        }
        if (productImage.length == 0) {
          notification.error({
            message: "Please select product's image(s).",
          });
          return;
        }
        productImage.forEach((file, index) => {
          formData.append(`images`, file);
        });
        // Otherwise, create a new product
        const response = await ProductService.save(formData);
        notification.success({
          message: "Product saved successfully",
        });
        console.log("Product saved successfully:", response);
      }

      onClose();
    } catch (error) {
      console.error("Error updating/saving product:", error);
    }
  };

  return (
    <div onSubmit={handleSubmit}>
      <MDBox p={2}>
        <MDBox mb={2}>
          <MDInput
            type="text"
            label="Product Name"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="text"
            label="Product Description"
            fullWidth
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
            multiline   // This makes the input behave as a textarea
            rows={4}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="number"
            label="Product Price"
            fullWidth
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="number"
            label="Product Quantity"
            fullWidth
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            required
          />
        </MDBox>
        <MDBox mb={2}>
          <MDBox mb={2}>
            <MDSelect
              label="Category"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              options={categories}
              required
            />
          </MDBox>
        </MDBox>
        <MDBox mb={2}>
          <label htmlFor="productName">Upload Product Image(s) </label>
          <input
            label="Category"
            type="file"
            multiple
            onChange={(e) => setProductImage(Array.from(e.target.files))}
            required
          />
        </MDBox>

        <MDButton
          variant="gradient"
          color="info"
          type="submit"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          {actionName}
        </MDButton>
      </MDBox>
    </div>
  );
}

export default ProductForm;

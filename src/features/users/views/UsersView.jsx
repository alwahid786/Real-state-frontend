import { useState } from "react";
// Table
import DataTable from "../../../components/DataTable";
import Modal from "../../../components/shared/Modal";
// icons
import EditIcon from "../../../assets/SVG/EditIcon";
import DeleteIcon from "../../../assets/SVG/DeleteIcon";
import Button from "../../../components/shared/Button";
import PlusIcon from "../../../assets/SVG/PlusIcon";
import Input from "../../../components/shared/Input";
import { useCreateUserMutation } from "../rtk/userApis";
const UsersView = () => {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "12345678",
  });

  // const handleSave = () => {
  //   console.log("User Data:", formData);
  //   setIsModalOpen(false);
  //   setFormData({ firstName: "", lastName: "", email: "", password: "" });
  // };

  // const handleSave = async () => {
  //   try {
  //     const userPayload = {
  //       name: `${formData.firstName} ${formData.lastName}`,
  //       email: formData.email,
  //       phone: formData.phone,
  //     };
  //     const response = await createUser(userPayload).unwrap();
  //     console.log("User created successfully:", response);
  //     alert("Invitation sent successfully!");
  //     setIsModalOpen(false);
  //     setFormData({ firstName: "", lastName: "", email: "", phone: "" });
  //   } catch (error) {
  //     console.error("Failed to create user:", error);
  //     alert(
  //       error.data?.message || "Failed to send invitation. Please try again."
  //     );
  //   }
  // };
  const handleSave = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await createUser({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
      }).unwrap();

      alert("User added successfully!");
      setIsModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "12345678",
        phone: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to add user. Please try again.");
    }
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone No.",
      selector: (row) => row.phone,
    },
    {
      name: "Created At",
      selector: (row) => row.createdAt,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-3 py-1 text-xs rounded-full text-white ${
            row.status === "Active"
              ? "bg-[#34C7591A] !text-[#34C759]"
              : "bg-[#E6CE6533] !text-[#FF9500]"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Action",
      cell: () => (
        <div className="flex gap-3">
          <EditIcon className="cursor-pointer" />
          <DeleteIcon className=" cursor-pointer" />
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
      createdAt: "12 Sep 2024",
      status: "Active",
    },

    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
      createdAt: "12 Sep 2024",
      status: "Pending",
    },
    {
      id: 3,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
      createdAt: "12 Sep 2024",
      status: "Pending",
    },
  ];

  return (
    <div className=" border-[#71717A] rounded-lg p-4 bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-xl font-medium text-[#09090B] ">
            User Management
          </h1>
        </div>
        <div className="mt-2 sm:mt-0">
          <Button
            text="Add New User"
            cn="px-4 py-2"
            icon={<PlusIcon />}
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {isModalOpen && (
          <Modal
            title="Add New User"
            onClose={() => setIsModalOpen(false)}
            width="w-[400px] md:w-[500px]"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1" htmlFor="firstName">
                  First Name *
                </label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="lastName">
                  Last Name *
                </label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="email">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="phone">
                  Phone No.*
                </label>
                <Input
                  type="text"
                  name="phone"
                  placeholder="+00 00 000 000"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button
                  text="Send Invitation"
                  cn="text-white px-4 py-2 !w-auto"
                  full
                  width
                  onClick={handleSave}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UsersView;

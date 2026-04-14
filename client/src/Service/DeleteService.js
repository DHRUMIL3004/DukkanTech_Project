import Swal from "sweetalert2";

export const confirmAction = async (
  title = "Are you sure?",
  text = "This action cannot be undone.",
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    width: "300px",
    padding: "1.5rem",
  });

  return result.isConfirmed;
};

export function useContactModal() {
  const isOpen = useState("contact-modal-open", () => false);
  // Number of mounted components that render the contact modal
  const hosts = useState("contact-modal-hosts", () => 0);

  const open = async () => {
    if (!hosts.value) {
      await navigateTo("/");
    }
    isOpen.value = true;
  };

  return { isOpen, hosts, open };
}

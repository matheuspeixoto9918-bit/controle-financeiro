interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ open, title, onClose, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="btn-secondary">
            Fechar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;

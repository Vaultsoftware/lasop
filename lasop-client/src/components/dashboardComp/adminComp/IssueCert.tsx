import { postCertificate } from '@/store/certificate/certificateStore';
import { handleCert } from '@/store/dashMenu/dashStore';
import { AppDispatch, RootState } from '@/store/store';
import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface PropsData {
  studentId: string;
  certTitle: string;
}
interface Props {
  props: PropsData;
}

function IssueCert({ props }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File | null>(null);
  const { studentId, certTitle } = props;
  const status = useSelector((state: RootState) => state.certificate.status);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('studentId', studentId);
    formData.append('certTitle', certTitle);

    const response = await dispatch(postCertificate(formData));
    if (postCertificate.fulfilled.match(response)) {
      const payload = response.payload;
      toast.success(payload.message || 'Certificate issued successfully');
      dispatch(handleCert());
    } else {
      toast.error(response.error?.message || 'Failed to issue certificate');
    }
  };

  return (
    <div className="applicant flex items-center justify-center w-full h-[100vh] fixed top-0 left-0 z-30 px-3 md:px-0">
      <form onSubmit={handleSubmit} className="p-3 rounded-md bg-white w-[330px] md:w-fit">
        <div
          onClick={() => dispatch(handleCert())}
          className="w-[30px] h-[30px] border border-slate-800 rounded-md flex items-center justify-center text-[14px] ml-auto cursor-pointer"
        >
          <MdClose />
        </div>
        <h3 className="text-[14px] font-semibold mb-3 mt-2">Certificate for {props.certTitle}</h3>
        <div className="frm_inp">
          <div className="cert_ctrl grid gap-2">
            <label htmlFor="certificate">Submit Certificate</label>
            <input type="file" id="certificate" onChange={handleFileChange} />
          </div>
        </div>
        <div className="cert_btn mt-3">
          <button
            className="w-full h-[40px] bg-accent rounded-md text-white text-[14px] flex items-center justify-center gap-2 disabled:opacity-60"
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <span
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden
                />
                Uploading...
              </>
            ) : (
              'Upload Certificate'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default IssueCert;

import { Button, Container } from "@mui/material";
import { MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TransferForm = () => {
    const {accounts} = useSelector((state) => state.account);
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to emerald-100 py-8">
            <Container maxWidth="sm">
                <Button
                    startIcon = {<MdArrowBack />}
                    onClick ={() => navigate("/dashboard")}
                    className="mb-6" 
                >
                    <p>
                        Back to Dashboard
                    </p>
                </Button>
            </Container>
        </div>
    );
};
export default TransferForm;
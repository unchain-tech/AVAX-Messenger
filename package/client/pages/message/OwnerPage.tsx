import Layout from "../../components/layout/Layout";
import RequireWallet from "../../components/layout/RequireWallet";
import { useWallet } from "../../hooks/useWallet";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import Error from "../../components/error/Error";
import ChangeOwnerValueForm from "../../components/form/ChangeOwnerValueForm";

export default function OwnerPage() {
  const { currentAccount, connectWallet } = useWallet();
  const { processing, owner, numOfPendingLimits, changeNumOfPendingLimits } =
    useMessengerContract({
      currentAccount: currentAccount,
    });

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        {owner === currentAccount ? (
          <ChangeOwnerValueForm
            processing={processing}
            currentValue={numOfPendingLimits}
            changeValue={changeNumOfPendingLimits}
          />
        ) : (
          <Error statusCode={404} />
        )}
      </RequireWallet>
    </Layout>
  );
}

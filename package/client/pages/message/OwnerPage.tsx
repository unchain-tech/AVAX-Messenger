import Layout from "../../components/layout/Layout";
import RequireWallet from "../../components/layout/RequireWallet";
import { useWallet } from "../../hooks/useWallet";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import { useEffect } from "react";
import Error from "../../components/error/Error";
import ChangeOwnerValueForm from "../../components/form/ChangeOwnerValueForm";

export default function OwnerPage() {
  const { currentAccount, connectWallet } = useWallet();
  const {
    mining,
    messengerContract,
    owner,
    numOfPendingLimits,
    getOwner,
    getNumOfPendingLimits,
    changeNumOfPendingLimits,
  } = useMessengerContract({
    currentAccount: currentAccount,
  });

  useEffect(() => {
    getOwner();
    getNumOfPendingLimits();
  }, [messengerContract]);

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        {owner === currentAccount ? (
          <ChangeOwnerValueForm
            mining={mining}
            currentValue={numOfPendingLimits}
            getValue={getNumOfPendingLimits}
            changeValue={changeNumOfPendingLimits}
          />
        ) : (
          <Error statusCode={404} />
        )}
      </RequireWallet>
    </Layout>
  );
}

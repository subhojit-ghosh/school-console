import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import moment from 'moment';
import { join } from 'path';

// Register font
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: join(
        __dirname,
        '../../../',
        'storage//fonts/static/Roboto-Regular.ttf'
      ),
      fontWeight: 400,
    },
    {
      src: join(
        __dirname,
        '../../../',
        'storage//fonts/static/Roboto-Medium.ttf'
      ),
      fontWeight: 500,
    },
    {
      src: join(
        __dirname,
        '../../../',
        'storage//fonts/static/Roboto-SemiBold.ttf'
      ),
      fontWeight: 600,
    },
    {
      src: join(
        __dirname,
        '../../../',
        'storage//fonts/static/Roboto-Bold.ttf'
      ),
      fontWeight: 700,
    },
    {
      src: join(
        __dirname,
        '../../../',
        'storage//fonts/static/Roboto-ExtraBold.ttf'
      ),
      fontWeight: 800,
    },
    {
      src: join(
        __dirname,
        '../../../',
        'storage//fonts/static/Roboto-Black.ttf'
      ),
      fontWeight: 900,
    },
  ],
});

const TransactionReceipt = ({ logo, data }: { logo: string; data: any }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#fff',
      fontSize: 11,
      paddingTop: 2,
      paddingLeft: 45,
      paddingRight: 10,
      lineHeight: 0,
      fontFamily: 'Roboto',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    titleContainer: {
      flexDirection: 'row',
      marginTop: 5,
    },
    titleTextContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#3E3E3E',
      gap: '1px',
    },
    logo: { width: 50, height: 50 },
    reportTitle: {
      fontSize: 15,
      textAlign: 'center',
      fontWeight: 900,
      lineHeight: 1,
    },
    defaultText: {
      fontSize: 10,
      lineHeight: 1,
      paddingRight: '3px',
      paddingLeft: '3px',
    },
    hrRuler: {
      display: 'flex',
      width: '100%',
      height: '2px',
      backgroundColor: '#000',
      marginTop: '10px',
      marginBottom: '10px',
    },
    hrCrossLine: {
      display: 'flex',
      width: '100%',
      height: '0px',
      backgroundColor: '#fff',
      borderBottom: '2px dashed #ccc',
      marginTop: '5px',
      marginBottom: '5px',
    },
    moneyReceipt: {
      textAlign: 'center',
      backgroundColor: '#3E3E3E',
      color: '#fff',
      width: '200px',
      padding: '5px',
      borderRadius: '10px',
      textTransform: 'capitalize',
      margin: '0 auto',
      fontSize: '10px',
      lineHeight: 0,
      marginBottom: '20px',
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '10px',
    },
    flexRowNoMargin: {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
      margin: 0,
    },
    flexRowNoMarginFirstCell: {
      width: '100px',
      border: '1px solid #000',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '2px',
    },
    flexRowNoMarginSecondCell: {
      width: '400px',
      border: '1px solid #000',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      borderLeftWidth: '0px',
      paddingTop: '2px',
    },
    flexRowNoMarginThirdCell: {
      width: '200px',
      border: '1px solid #000',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '2px',
      borderLeftWidth: '0px',
    },
    flex1: {
      flex: 1,
    },
    flexCol: {
      display: 'flex',
      flexDirection: 'column',
    },
    dashedLine: {
      flexGrow: '1',
      height: '13px',
      borderBottom: '1px dashed #000',
    },
    infoLabel: {
      width: '100px',
      fontSize: '11px',
      fontWeight: 500,
      // backgroundColor: 'red',
    },
    infoText: {
      width: '100px',
      fontSize: '11px',
      flexGrow: 1,
      // backgroundColor: 'green',
    },
    infoTextNoWidth: {
      // fontSize: '11px',
      // flexGrow: 1,
      // backgroundColor: 'green',
    },
    boldText: {
      fontSize: '10px',
      fontWeight: 500,
      lineHeight: 0,
    },
    textLeft: {
      textAlign: 'left',
    },
    textCenter: {
      textAlign: 'center',
    },
    textRight: {
      textAlign: 'right',
    },
  });

  const InvoiceHead = () => (
    <View
      style={{
        ...styles.flexRow,
        justifyContent: 'space-between',
        marginBottom: '0px',
      }}
    >
      <Text
        style={{
          width: '100px',
          fontSize: '10px',
        }}
      >
        No. {data.id}
      </Text>
      <Text
        style={{
          width: '100px',
          fontSize: '10px',
        }}
      >
        Date: {moment(data.createdAt).format('DD-MMM-YYYY')}
      </Text>
    </View>
  );

  const InvoiceTitle = ({
    moneyReceiptTitle,
  }: {
    moneyReceiptTitle: string;
  }) => (
    <View style={styles.titleContainer}>
      <Image style={styles.logo} src={`data:image/png;base64, ${logo}`} />
      <View style={styles.titleTextContainer}>
        <Text style={styles.reportTitle}>JDS PUBLIC SCHOOL</Text>
        <Text style={styles.defaultText}>
          Affiliated to CBSE (10+2) | Affiliation No: 2430445
        </Text>
        <Text style={styles.defaultText}>
          A B Road, Panpur, PO - Narayanpur, PS - Basudevpur, 24 Pgs. (N), PIN -
          743126, W.B
        </Text>
        <Text style={styles.defaultText}>
          Phone: 9062281887 | Email: accounts@jdsschool.in
        </Text>
        <Text
          style={{
            ...styles.defaultText,
            fontSize: '11px',
            fontWeight: 600,
            marginTop: '3px',
          }}
        >
          {moneyReceiptTitle}
        </Text>
      </View>
      <Image style={styles.logo} src={data.qrCodeDataURL} />
    </View>
  );

  const HrRuler = () => <View style={styles.hrRuler}></View>;

  const CrossLine = () => <View style={styles.hrCrossLine}></View>;

  const InvoiceTable = () => (
    <View style={{ ...styles.flexCol, marginBottom: '5px' }}>
      <View style={styles.flexRowNoMargin}>
        <Text
          style={{
            ...styles.boldText,
            ...styles.flexRowNoMarginFirstCell,
            ...styles.textLeft,
            flex: '1',
            paddingLeft: '5px',
            borderBottomWidth: '0px',
          }}
        >
          Fees Type
        </Text>
        <Text
          style={{
            ...styles.boldText,
            ...styles.flexRowNoMarginThirdCell,
            ...styles.textRight,
            flex: '1',
            paddingRight: '5px',
            borderBottomWidth: '0px',
          }}
        >
          Paid Amount (Rs.)
        </Text>
      </View>

      {(data.items || []).length > 0 && (
        <View style={styles.flexRowNoMargin}>
          <Text
            style={{
              ...styles.boldText,
              ...styles.flexRowNoMarginFirstCell,
              ...styles.textLeft,
              flex: '1',
              paddingLeft: '5px',
              borderBottomWidth: '0px',
            }}
          >
            Transport:
            {(data.items || []).map((rec, index) => (
              <Text key={index}>
                {' ' +
                  [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ][rec.month - 1]}
                {index < data.items.length - 1 && <>, </>}
              </Text>
            ))}
          </Text>
          <Text
            style={{
              ...styles.boldText,
              ...styles.flexRowNoMarginThirdCell,
              ...styles.textRight,
              flex: '1',
              paddingRight: '5px',
              borderBottomWidth: '0px',
            }}
          >
            {Number(data.totalAmount).toLocaleString('en-IN')}
          </Text>
        </View>
      )}

      <View style={styles.flexRowNoMargin}>
        <Text
          style={{
            ...styles.boldText,
            ...styles.flexRowNoMarginFirstCell,
            ...styles.textLeft,
            flex: '1',
            paddingLeft: '5px',
          }}
        >
          Total Amount
        </Text>
        <Text
          style={{
            ...styles.boldText,
            ...styles.flexRowNoMarginThirdCell,
            ...styles.textRight,
            flex: '1',
            paddingRight: '5px',
          }}
        >
          {Number(data.totalAmount).toLocaleString('en-IN')}
        </Text>
      </View>
      <View style={styles.flexRowNoMargin}>
        <Text
          style={{
            ...styles.boldText,
            ...styles.flexRowNoMarginFirstCell,
            ...styles.textLeft,
            flex: '1',
            paddingLeft: '5px',
            borderTopWidth: '0px',
          }}
        >
          Received Amount
        </Text>
        <Text
          style={{
            ...styles.boldText,
            ...styles.flexRowNoMarginThirdCell,
            ...styles.textRight,
            flex: '1',
            paddingRight: '5px',
            borderTopWidth: '0px',
          }}
        >
          {Number(data.totalAmount).toLocaleString('en-IN')}
        </Text>
      </View>
      <View style={styles.flexRowNoMargin}>
        <Text
          style={{
            ...styles.boldText,
            ...styles.flexRowNoMarginFirstCell,
            ...styles.textLeft,
            flexBasis: '270.5px',
            flexShrink: 0,
            paddingLeft: '5px',
            borderTopWidth: '0px',
          }}
        >
          Amount in Words
        </Text>
        {/* <Text
          style={{
            ...styles.boldText,
            ...styles.flexRowNoMarginFirstCell,
            ...styles.textLeft,
            paddingLeft: '5px',
            borderLeftWidth: '0px',
            borderTopWidth: '0px',
            flex: '1',
          }}
        >
          {data.totalInWords}
        </Text> */}
        <Text
          style={{
            ...styles.boldText,
            ...styles.flexRowNoMarginSecondCell,
            ...styles.textRight,
            flex: '2',
            paddingRight: '5px',
            borderTopWidth: '0px',
          }}
        >
          {data.totalInWords}
        </Text>
      </View>
    </View>
  );

  const FormSection = () => (
    <View style={styles.flexCol}>
      <View style={styles.flexRowNoMargin}>
        <View
          style={{
            ...styles.flexRowNoMargin,
            width: '40%',
          }}
        >
          <Text style={styles.infoLabel}>Registration No.:</Text>
          <Text style={{ ...styles.infoText, fontWeight: 500 }}>
            {data.regNo}
          </Text>
        </View>
        <View
          style={{
            ...styles.flexRowNoMargin,
            width: '37%',
          }}
        >
          <Text style={styles.infoLabel}>Session:</Text>
          <Text
            style={{
              ...styles.infoText,
              width: '100px',
            }}
          >
            {data.session}
          </Text>
        </View>
        <View
          style={{
            ...styles.flexRowNoMargin,
            width: '23%',
          }}
        >
          <Text style={{ ...styles.infoLabel }}>Receipt No.:</Text>
          <Text
            style={{
              ...styles.infoText,
              textAlign: 'right',
              paddingRight: '10px',
            }}
          >
            {data.id}
          </Text>
        </View>
      </View>
      <View style={styles.flexRowNoMargin}>
        <View style={{ ...styles.flexRowNoMargin, width: '40%' }}>
          <Text style={styles.infoLabel}>Student's Name:</Text>
          <Text style={{ ...styles.infoText, fontWeight: 500 }}>
            {data.studentName}
          </Text>
        </View>
        <View style={{ ...styles.flexRowNoMargin, width: '37%' }}>
          <Text style={styles.infoLabel}>Class:</Text>
          <Text style={{ ...styles.infoText, width: '100px' }}>
            {data.className}
          </Text>
        </View>
        <View style={{ ...styles.flexRowNoMargin, width: '23%' }}>
          <Text style={{ ...styles.infoLabel }}>Date:</Text>
          <Text
            style={{
              ...styles.infoText,
              textAlign: 'right',
              // paddingRight: '10px',
            }}
          >
            {moment(data.date).format('DD-MM-2024')}
          </Text>
        </View>
      </View>
      <View style={styles.flexRowNoMargin}>
        <View style={{ ...styles.flexRowNoMargin, width: '40%' }}>
          <Text style={styles.infoLabel}>Father's Name:</Text>
          <Text style={{ ...styles.infoText, fontWeight: 500 }}>
            {data.fathersName}
          </Text>
        </View>
        <View
          style={{
            ...styles.flexRowNoMargin,
            width: '60%',
            paddingRight: '10px',
          }}
        >
          <Text
            style={{
              ...styles.infoLabel,
              width: '100px',
            }}
          >
            Payment Mode:
          </Text>
          <Text
            style={{
              paddingRight: '1px',
            }}
          >
            {data.mode}
            {data.note && ` - ${data.note}`}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginBottom: '10px',
        }}
      ></View>

      <InvoiceTable />
    </View>
  );

  const SignatureSection = () => (
    <View
      style={{
        ...styles.flexRow,
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <View style={{ ...styles.flexCol }}>
        <View style={{ ...styles.flexCol, alignItems: 'center' }}>
          <Text
            style={{
              ...styles.defaultText,
              marginTop: '8px',
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '10px',
            }}
          >
            Guardian Signature
          </Text>
        </View>
      </View>

      <View style={{ ...styles.flexCol }}>
        <View style={{ ...styles.flexCol, alignItems: 'center' }}>
          <Text
            style={{
              ...styles.infoText,
              textAlign: 'center',
              fontSize: 10,
              fontWeight: 500,
            }}
          >
            {data.receivedBy}
          </Text>
          <Text
            style={{
              ...styles.defaultText,
              ...styles.boldText,
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '10px',
            }}
          >
            Received By
          </Text>
        </View>
      </View>
    </View>
  );

  const PrintComponents = ({
    moneyReceiptTitle,
  }: {
    moneyReceiptTitle: string;
  }) => {
    return (
      <>
        <View style={{ height: '100%' }}>
          <View style={{ flexGrow: 1 }}>
            <InvoiceTitle moneyReceiptTitle={moneyReceiptTitle} />
            <HrRuler />
            <FormSection />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <SignatureSection />
          </View>
        </View>
      </>
    );
  };

  return (
    <Document>
      <Page
        size="A4"
        style={{
          ...styles.page,
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <View>
          <PrintComponents
            moneyReceiptTitle={`Fees Receipt (Student's Copy)`}
          />
          <CrossLine />
        </View>
        <View style={{ marginTop: '10px' }}>
          <PrintComponents moneyReceiptTitle={`Fees Receipt (Office Copy)`} />
        </View>
      </Page>
    </Document>
  );
};

export default TransactionReceipt;

import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Create Document Component
const TransactionReceipt = ({ logo, data }: { logo: string; data: any }) => {
  console.log('debug-data', data);
  // Create styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#fff',
      fontSize: 11,
      paddingTop: 10,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
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
    logo: { width: 100, height: 100 },
    reportTitle: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 900,
      lineHeight: 1.3,
    },
    defaultText: {
      fontSize: 13,
      lineHeight: 1.4,
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
    moneyReceipt: {
      textAlign: 'center',
      backgroundColor: '#3E3E3E',
      color: '#fff',
      width: '100px',
      padding: '5px',
      borderRadius: '10px',
      textTransform: 'uppercase',
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
    flexTableRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    flexTableRowFirstCell: {
      width: '100px',
      border: '1px solid #000',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '5px',
    },
    flexTableRowSecondCell: {
      width: '400px',
      border: '1px solid #000',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '5px',
      borderLeftWidth: '0px',
    },
    flexTableRowThirdCell: {
      width: '200px',
      border: '1px solid #000',
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: '5px',
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
        No.
      </Text>
      {/* <Text
        style={{
          width: '600px',
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        Money receipt
      </Text> */}
      <Text
        style={{
          width: '100px',
          fontSize: '10px',
        }}
      >
        Date:
      </Text>
    </View>
  );
  const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
      <Image style={styles.logo} src={`data:image/png;base64, ${logo}`} />
      <View style={styles.titleTextContainer}>
        <Text style={styles.reportTitle}>JDS PUBLIC SCHOOL</Text>
        <Text style={styles.defaultText}>
          Panpur, P.O. Narayanpur, P.S. Basudevpur,
        </Text>
        <Text style={styles.defaultText}>
          Dist - 24Pgs.(N), Pin -743126, W.B.
        </Text>
        <Text style={styles.defaultText}>Phone: 9062281887 / 9062281890</Text>
      </View>
    </View>
  );
  const HrRuler = () => <View style={styles.hrRuler}></View>;

  const MoneyReceiptHead = () => (
    <Text style={styles.moneyReceipt}>Money Receipt</Text>
  );

  const InvoiceTable = () => (
    <View style={{ ...styles.flexCol, marginBottom: '20px' }}>
      <View style={styles.flexTableRow}>
        <Text
          style={{ ...styles.defaultText, ...styles.flexTableRowFirstCell }}
        >
          Sl.No.
        </Text>
        <Text
          style={{ ...styles.defaultText, ...styles.flexTableRowSecondCell }}
        >
          Description
        </Text>
        <Text
          style={{ ...styles.defaultText, ...styles.flexTableRowThirdCell }}
        >
          Amount
        </Text>
      </View>

      {(data.items || []).map((rec, index) => (
        <View style={styles.flexTableRow}>
          <Text
            style={{
              ...styles.defaultText,
              ...styles.flexTableRowFirstCell,
              borderTopWidth: '0px',
            }}
          >
            {index + 1}
          </Text>
          <Text
            style={{
              ...styles.defaultText,
              ...styles.flexTableRowSecondCell,
              borderTopWidth: '0px',
              textAlign: 'left',
              paddingLeft: '10px',
              textTransform: 'uppercase',
            }}
          >
            {rec.academicFeeName || ''}
          </Text>
          <Text
            style={{
              ...styles.defaultText,
              ...styles.flexTableRowThirdCell,
              borderTopWidth: '0px',
              textAlign: 'left',
            }}
          >
            {rec.paid || ''}
          </Text>
        </View>
      ))}

      <View style={styles.flexTableRow}>
        <Text
          style={{
            ...styles.defaultText,
            ...styles.flexTableRowFirstCell,
            borderTopWidth: '0px',
            textTransform: 'uppercase',
            textAlign: 'right',
            width: '500px',
            fontWeight: 700,
          }}
        >
          total
        </Text>
        <Text
          style={{
            ...styles.defaultText,
            ...styles.flexTableRowThirdCell,
            borderTopWidth: '0px',
            textAlign: 'left',
          }}
        >
          {data.totalAmount || ''}
        </Text>
      </View>
    </View>
  );

  const FormSection = () => (
    <View style={styles.flexCol}>
      <View style={styles.flexRow}>
        <Text style={styles.defaultText}>Name of Student</Text>
        <Text>{data.name || ''}</Text>
      </View>
      <View style={styles.flexRow}>
        <Text style={styles.defaultText}>Guardian Name</Text>
        <Text>{data.guardianName || ''}</Text>
        {/* <View style={styles.dashedLine}>

        </View> */}
      </View>
      <View style={styles.flexRow}>
        <View style={styles.flex1}>
          <View style={styles.flexRow}>
            <Text style={styles.defaultText}>Class</Text>
            <Text>{data.className || ''}</Text>
            {/* <View style={styles.dashedLine}></View> */}
          </View>
        </View>
        <View style={styles.flex1}>
          <View style={styles.flexRow}>
            <Text style={styles.defaultText}>Session</Text>
            {/* <View style={styles.dashedLine}></View> */}
            <Text>{data.session}</Text>
          </View>
        </View>
        <View style={styles.flex1}>
          <View style={styles.flexRow}>
            <Text style={styles.defaultText}>Roll No.</Text>
            <View style={styles.dashedLine}></View>
          </View>
        </View>
      </View>

      <InvoiceTable />

      <View style={styles.flexRow}>
        <Text style={styles.defaultText}>Ruppes In Words</Text>
        {/* <View style={styles.dashedLine}></View> */}
        <Text>{data.totalInWords} Only</Text>
      </View>
      <View style={styles.flexRow}>
        <View style={styles.dashedLine}></View>
      </View>
      <View style={{ ...styles.flexRow, marginTop: '5px' }}>
        <Text style={styles.defaultText}>Paid by:- CASH/UPI/CARD/CHQ.</Text>
        <Text>{data.mode || ''}</Text>
        {/* <View style={styles.dashedLine}></View> */}
      </View>
    </View>
  );

  const SignatureSection = () => (
    <View style={{ ...styles.flexRow, justifyContent: 'space-between' }}>
      <View style={{ ...styles.flexCol }}>
        <View style={styles.dashedLine}></View>
        <View style={{ ...styles.flexCol, alignItems: 'center' }}>
          <Text
            style={{
              ...styles.defaultText,
              marginTop: '10px',
              textAlign: 'center',
            }}
          >
            Signature of
          </Text>
          <Text style={{ ...styles.defaultText }}>Student / Guardian</Text>
        </View>
      </View>

      <View style={{ ...styles.flexCol }}>
        <View style={styles.dashedLine}></View>
        <View style={{ ...styles.flexCol, alignItems: 'center' }}>
          <Text
            style={{
              ...styles.defaultText,
              marginTop: '10px',
              textAlign: 'center',
            }}
          >
            Signature of
          </Text>
          <Text style={{ ...styles.defaultText }}>Cashier / Receiver</Text>
        </View>
      </View>
    </View>
  );

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
          <InvoiceHead />
          <InvoiceTitle />
          <HrRuler />
          <MoneyReceiptHead />
          <FormSection />
        </View>
        <SignatureSection />
      </Page>
    </Document>
  );
};

export default TransactionReceipt;

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Badge, Icon, Text } from '@rneui/base';
import { ITransactionEntry } from '../../types/definitions';
import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { deleteAsync } from 'expo-file-system';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

type Props = {
    entries: ITransactionEntry[] //array of entries
}

const Spreadsheet: React.FC<Props> = ({ entries }) => {

    const navigation = useNavigation();

    const [table, setTable] = useState<{ headers: string[], rows: any[], widthArr: number[] } | null>(null);

    const makeTable = () => {

        //strip off id before sharing
        const entriesToShare = entries.map((entry, key) => {
            //const { id, ...restOfEntry } = entry;
            //putting serial number first
            const entryWithSerialNumber = { SN: key + 1 } as unknown as ITransactionEntry
            Object.assign(entryWithSerialNumber, entry)
            return entryWithSerialNumber;
        })

        //prepare tabulation headers and rows
        const table = {
            //Below works but I prefer to group the dates for display
            /*headers: Object.keys(entriesToShare[0]),
            rows: entriesToShare.map((entry) => {
                return Object.values(entry)
            }),*/
            headers: ["S/N", "Date", "Description", "Amount", "Expense?"],
            rows: entriesToShare.map((entry) => {
                return [entry.SN, moment([entry.txnYear!, entry.txnMonth!, entry.txnDay!]).format("LL"), entry.description, new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(entry.amount), entry.expense ? 'Yes' : 'No']
            }),

            widthArr: [40, 70, 120, 100, 80]
        };
        setTable(table);

    }
    useEffect(() => {
        entries.length > 0 && makeTable();
    }, [entries])

    const tableView = () => (

        <View style={styles.container}>
            {
                table &&
                <ScrollView horizontal={true}>
                    <Table borderStyle={styles.cellBorders}>
                        <Row data={table.headers} widthArr={table.widthArr} style={styles.head} textStyle={styles.text} />
                        <ScrollView>
                            {/*<Rows data={table.rows} widthArr={table.widthArr} textStyle={styles.text} /> // This works but breaking down the rows below so as to wrap each row in touchable opacity*/}
                            {
                                table.rows.map((rowData, index) => {
                                    return (
                                        <TableWrapper key={index} style={styles.row} >
                                            {
                                                rowData.map((cellData: string, cellIndex: number) =>
                                                (
                                                    <TouchableOpacity key={cellIndex} onPress={() => navigation.navigate("EditEntryScreen" as never, { transactionEntryToEdit: entries.find((entry, index) => entry.id === rowData[0]) } as never)}>
                                                        <Cell key={cellIndex} data={cellData} textStyle={styles.text} width={table.widthArr[cellIndex]} borderStyle={styles.cellBorders}/>
                                                    </TouchableOpacity>
                                                )
                                            )}
                                        </TableWrapper>
                                    )
                                })
                            }
                        </ScrollView>
                    </Table>
                </ScrollView>
            }

        </View>
    )

    const pdfShare = async () => {
        const html = 
        `<html>
            <body>
                <table>
                    <caption>Personal Transactions</caption>
                    <thead>
                        <tr>
                            ${table!.headers.map((header) => `<th>${header}</th>`)}
                        </tr>
                    </thead>
                    <tbody>
                        ${table!.rows.map((row) => {
                            return `<tr>
                                ${row.map((cell:string) => `<td>${cell}</td>`)}
                            </tr>`
                        })}
                    </tbody>
                </table>
            </body>
    </html>`
    //console.log(html);
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({
            html,
            base64: false
        });
        //console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        await deleteAsync(uri);//clear from cache.
    }

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainerStyle, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "lightblue" }]}>
                <Text h3>Entries found... <Badge status="primary" value={entries.length} /></Text>
                <TouchableOpacity
                    style={{ height: 20, top: -9 }}
                    onPress={pdfShare}>
                    <Icon
                        name="share"
                        color="green"
                        size={15}
                        raised={true}
                    />
                </TouchableOpacity>

            </View>
            {
                tableView()
            }

        </View>
    )
}

Spreadsheet.defaultProps = {
    entries: []
}

export default Spreadsheet;

const styles = StyleSheet.create({
    /*
    container: {
        flex: 1,
        backgroundColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
    },*/
    title: { fontSize: 16, color: 'black' },
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    row: { flexDirection: 'row', backgroundColor: 'lightblue' },
    text: { margin: 3 },
    wrapper: { flexDirection: 'row' },
    inputContainerStyle: {
        width: '100%',
        padding: 6
    },
    cellBorders: { 
        borderWidth: 2, borderColor: '#c8e1ff' 
    }
});
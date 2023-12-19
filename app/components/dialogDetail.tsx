'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

export const DialogDetail = ({ idWorkOrder }: { idWorkOrder: string }) => {
    const [open, setOpen] = React.useState(false);

    const columns: GridColDef[] = [
        {
            field: 'a',
            headerName: 'Downtime',
            width: 90
        },
        {
            field: 'b',
            headerName: 'Begin time',
            width: 110,
        },
        {
            field: 'c',
            headerName: 'End time',
            width: 110,
        },
        {
            field: 'd',
            headerName: 'Duration dewntime',
            width: 150,
        },
        {
            field: 'e',
            headerName: 'Detail',
            width: 110,
        },
    ];

    const handleOpenNgDialog = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <React.Fragment>
                <Button variant="outlined" onClick={handleOpenNgDialog}>
                    Detail
                </Button>
                <Dialog
                    fullWidth
                    maxWidth='md'
                    open={open}
                    onClose={handleClose}
                >
                    <div className=' h-screen overflow-y-auto py-12'>
                        <Container maxWidth='md' className=''>
                            <div className='flex flex-col items-center space-y-2'>
                                <p className='text-6xl font-medium text-gray-600'>Detail</p>
                                <p>Work Order : {idWorkOrder}</p>
                                <div className="relative w-full">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className=" bg-white px-2 text-muted-foreground">
                                            OR
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <DataGrid
                                className='mt-0'
                                rows={[{ a: 'A', b: '09:13:58', c: '09:13:58', d: '1', e: 'Meeting' }]}
                                columns={columns}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                                pageSizeOptions={[10, 20, 50]}
                                disableRowSelectionOnClick
                                getRowId={row => row.a}
                            />
                            <div className='flex justify-center mt-4'>
                                <button
                                    className={`h-12 px-6 rounded-md border border-red-500 hover:border-red-700 text-red-500 hover:text-red-700 transition-colors duration-300 ease-in-out`}
                                    type='button'
                                    onClick={() => handleClose()}
                                >
                                    <div className='flex justify-center'>
                                        Close
                                    </div>
                                </button>
                            </div>

                        </Container>
                    </div>
                </Dialog>
            </React.Fragment>
        </div>
    )
}

'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridEditInputCellProps,
    GridEditInputCell,
    GridRenderEditCellParams,
    GridPreProcessEditCellProps,
} from '@mui/x-data-grid';
import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
} from '@mui/x-data-grid-generator';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
    return randomArrayItem(roles);
};


export default function DialogDetailEdit({ idWorkOrder }: { idWorkOrder: string }) {
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [idDelete, setIdDelete] = React.useState<GridRowId>('');

    const [rows, setRows] = React.useState<GridRowsProp>([{ id: '1', a: 'a', b: 'b', c: 'c', d: 1 }]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setOpenDelete(true);
        setIdDelete(id);
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
    }));

    function NameEditInputCell(props: GridRenderEditCellParams) {
        const { error } = props;

        return (
            <StyledTooltip open={!!error} title={error}>
                <GridEditInputCell {...props} />
            </StyledTooltip>
        );
    }

    // function renderPaymentMethod(params: GridEditInputCellProps) {
    //     return <GridEditInputCell {...params} /> ;
    // }

    function renderPaymentMethod(params: GridEditInputCellProps) {
        return <GridEditInputCell {...params} />
    }

    const columns: GridColDef[] = [
        {
            field: 'a',
            headerName: 'Code NG',
            width: 180,
        },
        {
            field: 'b',
            headerName: 'Description',
            width: 180,
        },
        {
            field: 'c',
            headerName: 'Part Component',
            width: 180,
        },
        {
            field: 'd',
            headerName: 'Qty',
            width: 100,
            flex: 1,
            editable: true,
            renderEditCell: renderPaymentMethod,
            type: 'number',
            renderCell: (params) => {
                return (
                    <div className='flex items-center justify-end bg-green-100 w-full h-full px-4'>
                        {params.row.d ? params.row.d : 0}
                    </div>
                ); // Format the date as you prefer
            },
            valueParser: (newValue) => {
                // แปลงค่าใหม่เป็นตัวเลข
                const parsedValue = parseFloat(newValue);

                // ตรวจสอบว่าค่าที่ผู้ใช้ป้อนมามีค่าน้อยกว่าหรือเท่ากับ 0
                if (isNaN(parsedValue) || parsedValue <= 0) {
                    return 0; // หรือค่าเริ่มต้นที่คุณต้องการ
                }

                return parsedValue;
            },
        },
        {
            field: 'deletItem',
            type: 'actions',
            cellClassName: 'actions',
            headerName: 'Delete',
            width: 160,
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        key={id}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Edit',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={id + '1'}
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key={id + '2'}
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        key={id + '3'}
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />
                ];
            },
        },//Edit
    ];


    const handleCloseDelte = () => {
        setOpenDelete(false);
    }

    const handleDelteById = () => {
        setRows(rows.filter((row) => row.id !== idDelete));
        setIdDelete('');
        setOpenDelete(false);
    }

    const handleOpenNgDialog = () => {
        setOpen(true);
    }

    const handleCloseDialog = () => {
        setOpen(false);
    }



    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleOpenNgDialog}>
                Ng order
            </Button>

            <Dialog
                fullWidth
                maxWidth='lg'
                open={open}
                onClose={handleCloseDialog}
            >
                <div className=' h-screen overflow-y-auto py-12 px-10'>
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
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        slotProps={{
                            toolbar: { setRows, setRowModesModel },
                        }}
                        className='h-10/12'
                    // isCellEditable={(params) => params.row.d > 1}

                    />
                    <div className='flex justify-center mt-4'>
                        <button
                            className={`h-12 px-6 rounded-md border border-red-500 hover:border-red-700 text-red-500 hover:text-red-700 transition-colors duration-300 ease-in-out`}
                            type='button'
                            onClick={() => handleCloseDialog()}
                        >
                            <div className='flex justify-center'>
                                Close
                            </div>
                        </button>
                    </div>
                    <Dialog
                        fullWidth
                        maxWidth='sm'
                        open={openDelete}
                        onClose={handleCloseDelte}
                    >
                        <DialogTitle>Delete Code NG</DialogTitle>
                        <div className='px-6'>
                            <div className=' border-gray-300' style={{ borderWidth: '0.5px' }} />
                        </div>
                        <DialogContent className='flex justify-end space-x-4'>

                            <button
                                onClick={() => setOpenDelete(false)}
                                className={`h-10 px-6 rounded-md border border-blue-500 hover:blue-red-700 text-blue-500 hover:text-blue-700 transition-colors duration-300 ease-in-out`}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleDelteById()}
                                className='h-10 px-6 rounded-md text-white bg-red-500 hover:bg-red-700  transition-colors duration-300 ease-in-out'
                            >
                                Delete
                            </button>
                        </DialogContent>
                    </Dialog>
                </div>
            </Dialog>
        </React.Fragment>
    );
}

import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState } from 'react';

function CartItemList({ cartItemList, onDeleteItem, onClearCart, onUpdateQuantity }) {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [openClearCartDialog, setOpenClearCartDialog] = useState(false);

    // Handle delete item click
    const handleDeleteItem = (itemId) => {
        setItemToDelete(itemId);
        setOpenDeleteDialog(true);
    };

    // Handle clear cart click
    const handleClearCart = () => {
        setOpenClearCartDialog(true);
    };

    return (
        <div>
            {cartItemList.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                    <div className="flex flex-col">
                        <span className='font-semibold text-lg'>{item.name}</span>
                        <span className='text-lg'>{item.variation}</span>
                        <span className='text-lg font-semibold'>₱{item.price}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                            <AlertDialogTrigger>
                                <Trash2Icon onClick={() => handleDeleteItem(item.id)} className="text-red-500 cursor-pointer" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this item from your cart?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            onDeleteItem(itemToDelete);
                                            setOpenDeleteDialog(false);
                                        }}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <span className=''>Quantity</span>
                        <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                            className="w-16 p-1 border"
                        />
                        <span className='font-bold text-xl'>₱{item.amount}</span>
                    </div>
                </div>
            ))}

            {/* Clear Cart Dialog */}
            {cartItemList.length > 0 && (
                <AlertDialog open={openClearCartDialog} onOpenChange={setOpenClearCartDialog}>
                    <AlertDialogTrigger>
                        <button onClick={handleClearCart} className="bg-red-500 mt-4 text-white h-10 w-24 rounded-lg">
                            Clear Cart
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to clear all items in your cart?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setOpenClearCartDialog(false)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    onClearCart();
                                    setOpenClearCartDialog(false);
                                }}
                            >
                                Clear Cart
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}

export default CartItemList;

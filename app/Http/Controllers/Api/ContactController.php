<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactMessage;
use App\Models\ContactInformation;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Store a new contact message
     */
    public function storeMessage(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'subject' => 'nullable|string|max:255',
                'urgency' => 'nullable|in:low,medium,high',
                'appointment_type' => 'nullable|in:walk_in,scheduled,consultation,other',
                'message' => 'required|string|max:1000',
            ]);

            $contactMessage = ContactMessage::create($data);

            Log::info('Contact message received', [
                'message_id' => $contactMessage->id,
                'name' => $contactMessage->name,
                'email' => $contactMessage->email
            ]);

            return response()->json([
                'message' => 'Message sent successfully!',
                'contact_message' => $contactMessage
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error storing contact message: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to send message'
            ], 500);
        }
    }

    /**
     * Get all contact messages
     */
    public function getMessages()
    {
        try {
            $messages = ContactMessage::orderBy('created_at', 'desc')->get();
            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error fetching contact messages: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch messages'], 500);
        }
    }

    /**
     * Update message status
     */
    public function updateMessageStatus(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'status' => 'required|in:unread,read,replied'
            ]);

            $message = ContactMessage::findOrFail($id);
            $message->update($data);

            return response()->json([
                'message' => 'Message status updated successfully',
                'contact_message' => $message
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating message status: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update message status'], 500);
        }
    }

    /**
     * Delete a contact message
     */
    public function deleteMessage($id)
    {
        try {
            $message = ContactMessage::findOrFail($id);
            $message->delete();

            return response()->json([
                'message' => 'Message deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting contact message: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete message'], 500);
        }
    }

    /**
     * Get contact information
     */
    public function getContactInfo()
    {
        try {
            $contactInfo = ContactInformation::getDefault();
            
            // Ensure business_hours is always an array
            if (!is_array($contactInfo->business_hours)) {
                $contactInfo->business_hours = [
                    'monday' => '',
                    'tuesday' => '',
                    'wednesday' => '',
                    'thursday' => '',
                    'friday' => '',
                    'saturday' => '',
                    'sunday' => ''
                ];
                $contactInfo->save();
            }
            
            return response()->json($contactInfo);
        } catch (\Exception $e) {
            Log::error('Error fetching contact information: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch contact information'], 500);
        }
    }

    /**
     * Update contact information
     */
    public function updateContactInfo(Request $request)
    {
        try {
            $data = $request->validate([
                'business_name' => 'required|string|max:255',
                'address' => 'required|string|max:500',
                'phone' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'website' => 'nullable|string|max:255',
                'business_hours' => 'required|array',
                'business_hours.monday' => 'required|string',
                'business_hours.tuesday' => 'required|string',
                'business_hours.wednesday' => 'required|string',
                'business_hours.thursday' => 'required|string',
                'business_hours.friday' => 'required|string',
                'business_hours.saturday' => 'required|string',
                'business_hours.sunday' => 'required|string',
                'additional_info' => 'nullable|string|max:500',
            ]);

            // Get the first contact information record or create one
            $contactInfo = ContactInformation::first();
            
            if ($contactInfo) {
                // Update existing record
                $contactInfo->update($data);
            } else {
                // Create new record if none exists
                $contactInfo = ContactInformation::create($data);
            }

            // Refresh the model to get updated data
            $contactInfo->refresh();

            return response()->json([
                'message' => 'Contact information updated successfully',
                'contact_information' => $contactInfo
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating contact information: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update contact information'], 500);
        }
    }
} 
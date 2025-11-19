import React from 'react'
import BackButton from '@/components/settings/BackButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ChangePasswordComponent = () => {
  return (
    <section id="change-password" className="p-4 flex flex-col gap-4">
      <header className="flex items-center gap-4">
        <BackButton backUrl="/settings" />
        <h1 className="text-3xl">Settings | Change Password</h1>
      </header>

      <section id="change-password-form-ctn" className="flex flex-col gap-4 mt-8 max-w-md">
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="current-password" className="text-gray-500 font-normal">Current Password</Label>
            <Input
              id="current-password"
              name="current-password"
              type="password"
              placeholder="Enter your current password"
              className="w-full h-12 text-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password" className="text-gray-500 font-normal">New Password</Label>
            <Input
              id="new-password"
              name="new-password"
              type="password"
              placeholder="Enter your new password"
              className="w-full h-12 text-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password" className="text-gray-500 font-normal">Confirm New Password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              className="w-full h-12 text-lg"
            />
          </div>

          <Button type="submit" className="w-full mt-4">
            Change Password
          </Button>
        </form>
      </section>
    </section>
  )
}

export default ChangePasswordComponent
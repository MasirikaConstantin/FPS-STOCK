<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPermission extends Model
{
    protected $fillable = [
        'user_id',
        'permission_id',
        'ref',
        'granted_at',
        'granted_by',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'permission_id' => 'integer',
        'ref' => 'string',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }
}

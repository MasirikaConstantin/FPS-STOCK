<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = [
        'name',
        'description',
        'ref',
        'module',
        'action',
        

    ];

    protected $casts = [
        'name' => 'string',
        'description' => 'string',
        'ref' => 'string',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_permissions')
                    ->withTimestamps()
                    ->withPivot('granted_by', 'granted_at');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'granted_by');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Profil extends Model
{
    protected $table = 'profils';

    protected $fillable = [
        'phone',
        'address',
        'user_id',
        'hopital_id',
        'ref',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hopital()
    {
        return $this->belongsTo(Hopital::class);
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->ref = Str::uuid();
        }); 
    }
    
}

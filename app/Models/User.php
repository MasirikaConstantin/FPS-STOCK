<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\MustVerifyEmail;


class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'avatar',
        'last_login_at',
        'last_login_ip',
    ];
    protected $keyType = 'string';
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }
    // Dans votre modèle User
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->ref = Str::uuid();
        });
    }



    public function profile()
    {
        return $this->hasOne(Profil::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions')
                   ->withTimestamps()
                   ->withPivot('granted_by', 'granted_at');
    }

    public function hospital()
    {
        return $this->hasOneThrough(
            Hopital::class,
            Profil::class,
            'user_id',
            'id',
            'id',
            'hopital_id'
        );
    }

    public function isAdminCentral(): bool
    {
        return $this->role === 'admin_central';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isMedicalStaff(): bool
    {
        return in_array($this->role, ['medecin', 'pharmacien', 'magasinier']);
    }

    public function scopeForHospital($query, $hospitalId)
    {
        return $query->whereHas('profile', function($q) use ($hospitalId) {
            $q->where('hopital_id', $hospitalId);
        });
    }
}
